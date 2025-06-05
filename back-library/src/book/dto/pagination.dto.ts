import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class PaginationDTO{

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 0, description: 'Starting point', required: false})
    skip: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @ApiProperty({ example: 10, description: 'Number of items to return', required: false})
    limit: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Search query string', required: false })
    query: string;

    @IsOptional()
    @ApiProperty({ 
        enum: ['title', 'author', 'publisher', 'available', '-title', '-author', '-publisher', '-available'],
        description: 'Primary sort field',
        required: false
    })
    sort1: 'title' | 'author' | 'publisher' | 'available' | '-title' | '-author' | '-publisher' | '-available';

    @IsOptional()
    @ApiProperty({ 
        enum: ['title', 'author', 'publisher', 'available', '-title', '-author', '-publisher', '-available'],
        description: 'Secondary sort field', 
        required: false
    })
    sort2: 'title' | 'author' | 'publisher' | 'available' | '-title' | '-author' | '-publisher' | '-available';
}