import { IsString, IsUUID } from 'class-validator';

export class RenameSessionDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;
}
