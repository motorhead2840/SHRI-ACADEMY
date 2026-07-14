# mentor_sagemaker — SageMaker training pipeline for Shri mentor fine-tuning
# Named mentor_sagemaker (not sagemaker) to avoid shadowing the AWS sagemaker SDK.

def is_capacity_error(error_code: str, error_message: str) -> bool:
    """Check if a SageMaker ClientError is due to insufficient instance capacity."""
    return (
        "InsufficientInstanceCapacity" in error_code or
        "CapacityLimitExceeded" in error_code or
        "ResourceLimitExceeded" in error_code or
        "insufficient capacity" in error_message.lower()
    )
