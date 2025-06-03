import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationDTO{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({ example: 30, description: 'Starting point'})
    skip: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({ example: 10, description: 'Number of items to return'})
    limit: number;
}