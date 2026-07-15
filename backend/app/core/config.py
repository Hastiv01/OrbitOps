import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "OrbitOps"
    API_V1_STR: str = "/api"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "orbitops")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    @property
    def DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            import urllib.parse
            # Standardize scheme
            if url.startswith("postgresql://") or url.startswith("postgres://"):
                scheme_split = url.split("://", 1)
                if len(scheme_split) == 2:
                    scheme, rest = scheme_split
                    # Split hostname from credentials using the last '@'
                    rest_split = rest.rsplit("@", 1)
                    if len(rest_split) == 2:
                        creds, host_db = rest_split
                        creds_split = creds.split(":", 1)
                        if len(creds_split) == 2:
                            user, password = creds_split
                            # Safely unquote and then quote to avoid double encoding
                            unquoted_user = urllib.parse.unquote(user)
                            unquoted_password = urllib.parse.unquote(password)
                            encoded_user = urllib.parse.quote_plus(unquoted_user)
                            encoded_password = urllib.parse.quote(unquoted_password, safe='')
                            url = f"postgresql+asyncpg://{encoded_user}:{encoded_password}@{host_db}"
                        else:
                            url = f"postgresql+asyncpg://{rest}"
            return url
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI/ML
    ML_MODELS_PATH: str = os.getenv("ML_MODELS_PATH", "../trained_models")
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
