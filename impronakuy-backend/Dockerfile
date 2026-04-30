# syntax=docker/dockerfile:1.6

# ============================================================
# Stage 1 — builder: compila wheels (bcrypt/cryptography requieren Rust en musl)
# ============================================================
FROM python:3.12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache \
        build-base \
        gcc \
        musl-dev \
        libffi-dev \
        openssl-dev \
        cargo \
        rust

COPY requirements.txt .

# Instala en un prefix aislado para copiarlo a la imagen final.
# Usamos `python -m pip` para no depender del binario `pip` en PATH.
RUN python -m pip install --no-cache-dir --prefix=/install -r requirements.txt


# ============================================================
# Stage 2 — runtime: imagen final mínima
# ============================================================
FROM python:3.12-alpine

WORKDIR /app

# Solo libs runtime (no toolchain)
RUN apk add --no-cache \
        libffi \
        openssl \
        libstdc++ \
 && addgroup -S app && adduser -S app -G app

# Copia los paquetes Python compilados desde el builder
COPY --from=builder /install /usr/local

# Código de la app
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./

# Volumen persistente (SQLite vive aquí)
RUN mkdir -p /app/data && chown -R app:app /app

USER app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

# DEC-B009: --workers 1 (ConnectionManager singleton)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
