import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Is } from "sequelize-typescript";

export class CreateBookDto {
    @ApiProperty({ example: "The lord of the circles", description: 'THe book title'})
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: "It contains the 3 most...", description: 'The book description'})
    @IsOptional()
    @IsString()
    description: string;
    
    @ApiProperty({ example: "John Doe", description: 'The book author'})
    @IsNotEmpty()
    @IsString()
    author: string;
    
    @ApiProperty({ example: "Printers 27", description: 'The book publisher'})
    @IsNotEmpty()
    @IsString()
    publisher: string;
    
    @ApiProperty({ example: "book-picture.jpg", description: 'The book picture'})
    @IsOptional()
    @IsString()
    fileCover: string;
    
    @ApiProperty({ example: true, description: 'Available flag'})
    @IsOptional()
    available: boolean;
    //deleted: boolean;
}
