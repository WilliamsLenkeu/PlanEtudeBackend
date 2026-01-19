import { ObjectId } from '../../../shared/types';
import { Theme } from '../domain/Theme';

export class ThemeResponseDto {
  constructor(
    public id: ObjectId,
    public key: string,
    public name: string,
    public description: string | undefined,
    public priceXP: number,
    public config: {
      primaryColor: string;
      secondaryColor?: string;
      backgroundColor: string;
      fontFamily: string;
    },
    public previewUrl: string | undefined,
    public createdAt: Date
  ) {}

  static fromDomain(theme: Theme): ThemeResponseDto {
    return new ThemeResponseDto(
      theme.id,
      theme.key,
      theme.name,
      theme.description,
      theme.priceXP,
      theme.config,
      theme.previewUrl,
      theme.createdAt
    );
  }
}

export class CreateThemeRequestDto {
  constructor(
    public key: string,
    public name: string,
    public description: string | undefined,
    public priceXP: number,
    public config: {
      primaryColor: string;
      secondaryColor?: string;
      backgroundColor: string;
      fontFamily: string;
    },
    public previewUrl: string | undefined
  ) {}
}

export class UpdateThemeRequestDto {
  constructor(
    public name?: string,
    public description?: string,
    public priceXP?: number,
    public config?: {
      primaryColor: string;
      secondaryColor?: string;
      backgroundColor: string;
      fontFamily: string;
    }
  ) {}
}