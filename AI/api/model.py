import torch.nn as nn
import torchvision.models as models


class EfficientNetBinary(nn.Module):
    def __init__(self, input_channels=3, num_classes=1, dropout_rate=0.25):
        super(EfficientNetBinary, self).__init__()
        self.base_model = models.efficientnet_b0(
            weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)

        if input_channels != 3:
            self.base_model.features[0][0] = nn.Conv2d(
                input_channels, 32, kernel_size=3, stride=2, padding=1, bias=False
            )

        for param in self.base_model.parameters():
            param.requires_grad = False

        for layer in list(self.base_model.features[-1].children())[-30:]:
            for param in layer.parameters():
                param.requires_grad = True

        self.base_model.classifier = nn.Identity()
        num_features = self.base_model.features[-1][0].out_channels

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(dropout_rate),
            nn.Linear(num_features, num_classes),
            nn.Sigmoid()
        )

    def forward(self, x):
        x = self.base_model(x)
        x = self.classifier(x)
        return x
