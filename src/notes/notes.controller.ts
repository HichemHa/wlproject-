import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Note } from './schema/note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}


  

  //user routers

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto,@Request() req: any) {
    let useremail:any = req.user.email;
    return this.notesService.create(createNoteDto,useremail);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserNotes(@Request() req: any){
    let useremail:any = req.user.email;
    return this.notesService.findUserNotes(useremail);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto,@Request() req: any) {
    let useremail:any = req.user.email;

    return this.notesService.update(id, updateNoteDto,useremail);
  }

  // when user want to check/update a note for another user

  @UseGuards(JwtAuthGuard)
  @Get('/:anotheruser/:noteid')
  findAnotherUserNotes(@Request() req: any,@Param('anotheruser') anotheruser: string,@Param('noteid') noteid: string,){
    

    return this.notesService.findAnotherUserNotes(anotheruser,noteid);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:emailacees/:idnote')
  upadteNoteForAnotherUser(@Request() req: any,@Param('emailacees') emailAcees: string,@Param('idnote') idnote: string,@Body() noteToUpadte: Note){
    let userEmail:string = req.user.email;
    return this.notesService.upadteNoteForAnotherUser(userEmail,emailAcees,idnote,noteToUpadte)
  }
  
}
