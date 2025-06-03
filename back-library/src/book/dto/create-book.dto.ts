import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
    @ApiProperty({ example: "The lord of the circles", description: 'THe book title'})
    title: string;

    @ApiProperty({ example: "It contains the 3 most...", description: 'The book description'})
    description: string;
    
    @ApiProperty({ example: "John Doe", description: 'The book author'})
    author: string;
    
    @ApiProperty({ example: "Printers 27", description: 'The book publisher'})
    publisher: string;
    
    @ApiProperty({ example: "book-picture.jpg", description: 'The book picture'})
    fileCover: string;
    //available: boolean;
    //deleted: boolean;
}
