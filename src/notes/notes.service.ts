import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schema/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly model: Model<NoteDocument>,
  ) {}

   //user routers

  async create(createNoteDto: CreateNoteDto, useremail: string): Promise<Note> {
    let creatModel = new this.model({
      ...createNoteDto,
      user: useremail,
      creactedAt: Date.now(),
    });
    return creatModel.save();
  }

 
  async findUserNotes(useremail: string): Promise<Note[]> {
    return await this.model.find({ user: useremail }).exec();
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    useremail: string,
  ): Promise<any> {
    let checkFetch: any = await this.model.findOne({
      $and: [{ _id: id }, { user: useremail }],
    });
    if (checkFetch) {
      let Result: any = await this.model
        .findOneAndUpdate({ _id: id }, updateNoteDto)
        .exec();
      return `note id = ${Result._id} is updated`;
    } else {
      return 'please enter a valid id or this note is not yours';
    }
  }
  // when user want to check/update a note for another user

  async findAnotherUserNotes(
    anotheruser: string,
    noteid: string,
  ): Promise<any[]> {
    let userhaveaccessforreadonly: any = await this.model.find({
      $and: [
        {
          _id: noteid,
        },
        { userhaveaccessforreadonly: anotheruser },
      ],
    });
    let userhavefullaccess: any = await this.model.find({
      $and: [
        {
          _id: noteid,
        },
        { userhavefullaccess: anotheruser },
      ],
    });
    console.log('userhaveaccessforreadonly', userhaveaccessforreadonly.length);
    console.log('userhavefullaccess', userhavefullaccess.length);
    let msg: any = {
      fullAcc: 'user can userhavefullaccess ',
      readonly: 'use can userhaveaccessforreadonly',
      noAccess: 'no acesss',
    };
    if (
      userhaveaccessforreadonly.length > 0 &&
      userhavefullaccess.length === 0
    ) {
      return userhaveaccessforreadonly;
    } else if (
      userhaveaccessforreadonly.length === 0 &&
      userhavefullaccess.length > 0
    ) {
      return userhavefullaccess;
    } else {
      return msg.noAccess;
    }
  }

  async upadteNoteForAnotherUser(
    userEmail: string,
    emailAcees: string,
    idnote: string,
    noteToUpadte: Note,
  ): Promise<any> {
    let userhaveaccessforreadonly = await this.model
      .findOne({
        $and: [{ _id: idnote },{ user: emailAcees }, { userhaveaccessforreadonly: userEmail }],
      })
      .exec();
    console.log(userhaveaccessforreadonly);
    if (userhaveaccessforreadonly) {
      return "you can't edit this note ==> Just read only";
    } else {
      let userhavefullaccess = await this.model
        .findOne({
          $and: [{ user: emailAcees }, { userhavefullaccess: userEmail }],
        })
        .exec();

      if (userhavefullaccess) {
        await this.model.findOneAndUpdate({ _id: idnote }, noteToUpadte).exec();
        return 'updated';
      } else {
        return 'you dont have any access';
      }
    }
  }
}
