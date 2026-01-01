from pathlib import Path
import json
import logging
import logging.config

def setup_logging(app_env: str) -> None:
    env = app_env.strip().lower()
    level = "DEBUG" if env == "development" or env == "dev" else "INFO"

    Path("logs").mkdir(parents=True, exist_ok=True)

    config_path = Path(__file__).with_name("logging_config.json")
    with config_path.open("r", encoding="utf-8") as f:
        config = json.load(f)

    config["root"]["level"] = level
    config["handlers"]["console"]["level"] = level

    logging.config.dictConfig(config)

    logging.getLogger("uvicorn").setLevel(level)
    logging.getLogger("uvicorn.error").setLevel(level)
    logging.getLogger("uvicorn.access").setLevel(level)