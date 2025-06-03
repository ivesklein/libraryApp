export class Book {
    constructor(
        public id: number,
        public title: string,
        public author: string,
        public description: string,
        public publisher: string,
        public fileCover: string,
        public available: boolean,
        public deleted: boolean
    ) {}

    
}