FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PORT=8000
WORKDIR /app
COPY requirements.txt .
ENV PIP_DEFAULT_TIMEOUT=120 PIP_RETRIES=10
RUN pip install --no-cache-dir --retries 10 --timeout 120 -r requirements.txt
COPY . .
RUN useradd --create-home --uid 10001 careeros && mkdir -p /app/data && chown -R careeros:careeros /app
USER careeros
ENV CAREEROS_DATA_DIR=/app/data
EXPOSE 8000
CMD ["sh","-c","uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
