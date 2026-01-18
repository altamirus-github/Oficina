from io import BytesIO

from PIL import Image


def process_image(data: bytes, max_size: int = 1600, quality: int = 80) -> bytes:
    image = Image.open(BytesIO(data))
    image = image.convert("RGB")
    image.thumbnail((max_size, max_size))
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=quality, optimize=True)
    return buffer.getvalue()
