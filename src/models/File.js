import { model, Schema } from 'mongoose';

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  path: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

const File = model('File', fileSchema);

export default File;
