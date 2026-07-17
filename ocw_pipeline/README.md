# OpenCourseWare (OCW) Data Acquisition, Curation, & Training Pipeline

This pipeline automates the ingestion, quality filtering, safety curation, and Socratic conversion of university-level OpenCourseWare (OCW) materials into training-ready formats for the Shri Academy AI Mentor. It preserves the proprietary O(1) SRI Architecture and ensures strict factual accuracy with zero hallucinations.

---

## 🏛️ Ethical & Legal Usage (Attribution & Fair-Use)

OCW materials (such as lecture notes, readings, problem sets, and syllabi) are openly licensed by prestigious universities (such as MIT, Stanford, Harvard, and Yale) under **Creative Commons Licenses** (e.g., CC BY-NC-SA) for educational, non-commercial purposes.

### Fair Use & License Compliance Notes:
1. **Educational Purpose**: All curated material is used strictly for non-commercial educational training under the auspices of the SHRI-ACADEMY project.
2. **Proper Attribution**: Any downstream model or dataset generated through this pipeline must maintain attribution to the respective universities (MIT, Stanford, Harvard Open Learning, etc.) as detailed in our metadata indexes.
3. **ShareAlike**: Models fine-tuned using these materials will carry compatible open, sharing-oriented licensing terms.
4. **Khan Academy Exclusion Policy**: To align with SHRI-ACADEMY's proprietary curriculum design, **all commercial/Khan Academy content is strictly and programmatically excluded** from this pipeline via multi-stage regex and keyword safety checks.

---

## 🏗️ Pipeline Architecture

The pipeline consists of four main components in `ocw_pipeline/`:

1. **`crawler.py`**: Fetches text-heavy course materials. Supports direct crawling of target academic URLs, with a high-fidelity local fallback representing courses on educational psychology, human development, and the Advaita philosophy of unity (Atman) by Shri Narayana Guru.
2. **`curator.py`**: Performs Jaccard-based deduplication, character normalization, quality scoring, and safety screening.
3. **`processor.py`**: Converts raw texts into:
   - Plain text corpora for continued pre-training.
   - Socratic Q&A SFT chat datasets (utilizes teacher-student distillation via the NVIDIA Nemotron NIM API if available, or falls back to a custom template-based pedagogical generator).
4. **`pipeline.py`**: The orchestrator. Coordinates crawler, curator, and processor steps, and registers the datasets and metrics under **MLflow** for precise tracking and versioning.

---

## ⚙️ How to Run the Pipeline

### Prerequisites
Ensure python dependencies are installed:
```bash
pip install boto3 mlflow openai
```

### Execution Commands

#### 1. Run the entire OCW pipeline (Ingest, Curate, and Process):
```bash
python ocw_pipeline/pipeline.py \
  --output-dir /home/runner/work/SHRI-ACADEMY/SHRI-ACADEMY/data/ocw_curated \
  --quality-threshold 0.3 \
  --pairs-per-doc 4
```

This will write three files to `/home/runner/work/SHRI-ACADEMY/SHRI-ACADEMY/data/ocw_curated`:
- `pretrain.txt`: Raw text corpus for pre-training.
- `train.jsonl`: Socratic chat records for SFT fine-tuning.
- `manifest.json`: Pipeline run details.

#### 2. Incorporate OCW into Synthetic Training Generation:
Use `--ocw-data-path` to merge the curated OCW SFT records with the standard syllabus chunks:
```bash
python shri-academy-api/mentor_sagemaker/generate_data.py \
  --bucket your-sagemaker-s3-bucket \
  --prefix mentor-training/ocw-data \
  --ocw-data-path /home/runner/work/SHRI-ACADEMY/SHRI-ACADEMY/data/ocw_curated/train.jsonl
```

#### 3. Launch QLoRA Fine-Tuning on SageMaker:
Initiate the training job using the merged dataset on S3:
```bash
python shri-academy-api/mentor_sagemaker/launch_training.py \
  --role-arn arn:aws:iam::123456789012:role/sri-production-sagemaker \
  --bucket your-sagemaker-s3-bucket \
  --data-s3-uri s3://your-sagemaker-s3-bucket/mentor-training/ocw-data/train.jsonl
```

---

## 🧠 SFT Best Practices (LoRA & QLoRA)

We fine-tune **`nvidia/Nemotron-Mini-4B-Instruct`** in 4-bit (QLoRA) using Hugging Face PEFT/trl. This provides excellent memory efficiency while maintaining alignment with our thermodynamic phase cancellation mechanisms.

### Recommended Hyperparameters:
- **Base Model**: `nvidia/Nemotron-Mini-4B-Instruct` (Mistral-based 4B params)
- **Quantization**: 4-bit NormalFloat (NF4) with double quantization
- **PEFT Method**: LoRA
  - Rank ($r$): `16`
  - Alpha ($\alpha$): `32`
  - Target Modules: All linear projections (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`)
- **Optimizer**: `paged_adamw_8bit`
- **Learning Rate**: `2e-4` with Cosine decay
- **Epochs**: `3`

---

## 🚀 Airflow Orchestration

The pipeline is fully orchestrated weekly/monthly using the Apache Airflow DAG located in `airflow/dags/ocw_integration_and_train.py`. It handles:
1. Running the local crawler & curation pipeline.
2. Triggering the API server's data generation.
3. Submitting the SageMaker QLoRA training.
4. Monitoring training state & deploying to the inference endpoint.
