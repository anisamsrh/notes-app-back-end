const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  notes.push({
    id, title, createdAt, updatedAt, tags, body,
  });

  const isSuccess = notes.filter((note) => note.id === id.length > 0);

  if (isSuccess) {
    const response = h.response({ status: 'success', message: 'Catatan berhasil ditambahkan', data: { noteId: id } }).code(200);

    return response;
  }

  const response = h.response({ status: 'fail', message: 'Catatan gagal ditambahkan' }).code(500);
  return response;

  // {
  //   id: string,
  //   title: string,
  //   createdAt: string,
  //   updatedAt: string,
  //   tags: array of string,
  //   body: string,
  //  },
};

const getAllNotesHandler = () => ({ status: 'success', data: { notes } });

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (!note) {
    return h.response({ status: 'fail', message: 'Catatan tidak ditemukan' }).code(404);
  }

  return h.response({ status: 'success', data: { note } });
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return h.response({ status: 'fail', message: 'Gagal memperbaharui catatan. Id tidak ditemukan' }).code(404);
  }

  notes[index] = {
    ...notes[index], title, tags, body, updatedAt,
  };

  return h.response({ status: 'success', message: 'Catatan berhasil diperbaharui' }).code(200);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes.splice(index, 1);

    return h.response({ status: 'success', message: 'Catatan berhasil dihapus' }).code(200);
  }

  return h.response({ status: 'fail', message: 'Catatan gagal dihapus. Id tidak ditemukan' }).code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
