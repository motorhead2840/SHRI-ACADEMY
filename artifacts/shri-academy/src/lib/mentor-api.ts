export async function mentorLogin(data: any) {
  const res = await fetch('/api/mentor/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function mentorRegister(data: any) {
  const res = await fetch('/api/mentor/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMentorMe(token: string) {
  const res = await fetch('/api/mentor/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function getMentorMetrics(token: string) {
  const res = await fetch('/api/mentor/metrics', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function getSageMakerStatus(token: string) {
  const res = await fetch('/api/shri/sagemaker/status', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Failed to fetch SageMaker status');
  return res.json();
}

export async function generateSageMakerData(token: string, data: { pairs_per_chunk?: number; s3_prefix?: string }) {
  const res = await fetch('/api/shri/sagemaker/generate-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.detail || parsed.error || 'Failed to generate synthetic data');
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        throw new Error(text || 'Failed to generate synthetic data');
      }
      throw e;
    }
  }
  return res.json();
}

export async function trainSageMakerModel(token: string, data: { data_s3_uri: string; model_id?: string; instance_type?: string }) {
  const res = await fetch('/api/shri/sagemaker/train', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.detail || parsed.error || 'Failed to start SageMaker training');
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        throw new Error(text || 'Failed to start SageMaker training');
      }
      throw e;
    }
  }
  return res.json();
}

export async function deploySageMakerEndpoint(token: string, data: { model_data_s3: string; endpoint_name?: string; instance_type?: string }) {
  const res = await fetch('/api/shri/sagemaker/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.detail || parsed.error || 'Failed to deploy SageMaker endpoint');
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        throw new Error(text || 'Failed to deploy SageMaker endpoint');
      }
      throw e;
    }
  }
  return res.json();
}
