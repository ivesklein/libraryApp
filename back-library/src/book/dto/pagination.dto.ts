import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationDTO{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({ example: 0, description: 'Starting point', required: false})
    skip: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({ example: 10, description: 'Number of items to return', required: false})
    limit: number;

    @IsString()
    @IsOptional()
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