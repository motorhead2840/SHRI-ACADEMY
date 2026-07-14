"""
deploy_endpoint.py — Deploy a trained Shri mentor model as a SageMaker real-time endpoint.

Run after the training job completes and the model.tar.gz is in S3.

Usage:
    python shri-academy-api/sagemaker/deploy_endpoint.py \
        --role-arn arn:aws:iam::123456789012:role/SageMakerExecutionRole \
        --model-data s3://my-bucket/mentor-training/output/<job>/output/model.tar.gz \
        --endpoint-name shri-mentor-v1 \
        --region us-east-1

Env vars:
    SAGEMAKER_ROLE_ARN
    AWS_REGION
"""

import argparse
import json
import logging
import os

import boto3
import sagemaker
from botocore.exceptions import ClientError
from sagemaker.huggingface import HuggingFaceModel

from mentor_sagemaker import is_capacity_error

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

INFERENCE_INSTANCE = "ml.g4dn.xlarge"  # 1× T4 — sufficient for 4B inference

HF_CONTAINER = {
    "pytorch_version": "2.1.0",
    "transformers_version": "4.37.0",
    "py_version": "py310",
}


def deploy(
    role_arn: str,
    model_data_s3: str,
    endpoint_name: str,
    region: str = "us-east-1",
    instance_type: str = INFERENCE_INSTANCE,
    hf_token: str | None = None,
) -> dict:
    boto_session = boto3.Session(region_name=region)
    session = sagemaker.Session(boto_session=boto_session)

    environment = {
        "HF_TASK": "text-generation",
        "MAX_NEW_TOKENS": "1024",
    }
    if hf_token:
        environment["HF_TOKEN"] = hf_token

    model = HuggingFaceModel(
        model_data=model_data_s3,
        role=role_arn,
        sagemaker_session=session,
        transformers_version=HF_CONTAINER["transformers_version"],
        pytorch_version=HF_CONTAINER["pytorch_version"],
        py_version=HF_CONTAINER["py_version"],
        env=environment,
    )

    fallbacks = ["ml.g4dn.xlarge", "ml.g5.xlarge", "ml.g4dn.2xlarge", "ml.g5.2xlarge"]
    candidates = [instance_type]
    for fb in fallbacks:
        if fb not in candidates:
            candidates.append(fb)

    last_error = None
    for i, current_instance in enumerate(candidates):
        # If we are retrying, clean up any previous partially created endpoint with the same name
        if i > 0:
            try:
                log.info(f"Cleaning up potentially conflicting endpoint '{endpoint_name}' before retry...")
                session.delete_endpoint(endpoint_name)
            except ClientError as cleanup_err:
                error_code = cleanup_err.response.get("Error", {}).get("Code", "")
                if "ValidationException" in error_code or "ResourceNotFound" in error_code:
                    log.info(f"Endpoint '{endpoint_name}' did not exist. No cleanup needed.")
                else:
                    log.warning(f"Cleanup of existing endpoint '{endpoint_name}' failed: {cleanup_err}")
            except Exception as cleanup_err:
                log.warning(f"Cleanup of existing endpoint '{endpoint_name}' failed due to unexpected error: {cleanup_err}")

            try:
                session.delete_endpoint_config(endpoint_name)
            except ClientError as cleanup_err:
                error_code = cleanup_err.response.get("Error", {}).get("Code", "")
                if "ValidationException" in error_code or "ResourceNotFound" in error_code:
                    log.info(f"Endpoint config '{endpoint_name}' did not exist. No cleanup needed.")
                else:
                    log.warning(f"Cleanup of existing endpoint config '{endpoint_name}' failed: {cleanup_err}")
            except Exception as cleanup_err:
                log.warning(f"Cleanup of existing endpoint config '{endpoint_name}' failed due to unexpected error: {cleanup_err}")

        log.info(f"Deploying to endpoint '{endpoint_name}' on {current_instance} (attempt {i+1}/{len(candidates)}) ...")
        try:
            predictor = model.deploy(
                initial_instance_count=1,
                instance_type=current_instance,
                endpoint_name=endpoint_name,
            )
            result = {
                "endpoint_name": endpoint_name,
                "model_data": model_data_s3,
                "instance_type": current_instance,
                "region": region,
                "status": "InService",
            }
            log.info(f"Endpoint deployed: {result}")
            return result
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "")
            error_message = e.response.get("Error", {}).get("Message", "")
            last_error = e

            if is_capacity_error(error_code, error_message):
                log.warning(f"Capacity error on {current_instance}: {error_code} - {error_message}. Trying next fallback...")
                continue
            else:
                log.error(f"Non-capacity error on {current_instance}: {e}")
                raise e
        except Exception as e:
            log.error(f"Unexpected error on {current_instance}: {e}")
            raise e

    # If we exited the loop, it means we ran out of candidates
    msg = "All fallback instance types exhausted for endpoint deployment."
    log.error(msg)
    raise RuntimeError(msg) from last_error


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--role-arn", default=os.environ.get("SAGEMAKER_ROLE_ARN"))
    parser.add_argument("--model-data", required=True, help="S3 URI of model.tar.gz")
    parser.add_argument("--endpoint-name", default="shri-mentor-v1")
    parser.add_argument("--region", default=os.environ.get("AWS_REGION", "us-east-1"))
    parser.add_argument("--instance-type", default=INFERENCE_INSTANCE)
    parser.add_argument("--hf-token", default=os.environ.get("HF_TOKEN"))
    args = parser.parse_args()

    if not args.role_arn:
        raise ValueError("--role-arn or SAGEMAKER_ROLE_ARN env var is required")

    result = deploy(
        role_arn=args.role_arn,
        model_data_s3=args.model_data,
        endpoint_name=args.endpoint_name,
        region=args.region,
        instance_type=args.instance_type,
        hf_token=args.hf_token,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
