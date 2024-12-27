interface PlaceholderOptions {
  width?: number;
  height?: number;
  background?: string;
  foreground?: string;
  text?: string;
}

export class Placeholder {
  private static readonly BASE_URL = 'https://placehold.co';
  private static readonly DEFAULT_OPTIONS: PlaceholderOptions = {
    width: 48,
    height: 48,
    background: '2a2a2a',
    foreground: '525252',
    text: '',
  };

  static generate(options: PlaceholderOptions = {}): string {
    const { width, height, background, foreground, text } = {
      ...this.DEFAULT_OPTIONS,
      ...options,
    };

    let url = `${this.BASE_URL}/${width}x${height}`;

    // Add colors if specified
    if (background || foreground) {
      url += `/${background}/${foreground}`;
    }

    // Add text if specified
    if (text) {
      url += `?text=${encodeURIComponent(text)}`;
    }

    return url;
  }

  static avatar(size = 48): string {
    return this.generate({
      width: size,
      height: size,
      text: 'Avatar',
    });
  }

  static nft(size = 48): string {
    return this.generate({
      width: size,
      height: size,
      text: 'NFT',
    });
  }

  static image(width = 48, height = 48): string {
    return this.generate({
      width,
      height,
      text: 'Image',
    });
  }
}
