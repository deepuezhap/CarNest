import torch
import clip
from PIL import Image

# Load the model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Test with an image
image_path = "./images/car.jpg"  # Replace with an actual image
image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

# Encode image
with torch.no_grad():
    image_features = model.encode_image(image)

# Normalize features
image_features /= image_features.norm(dim=-1, keepdim=True)

print("Image features shape:", image_features.shape)
