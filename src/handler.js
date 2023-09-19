import { nanoid } from 'nanoid';
import { books } from './books.js';

const addBookHandler = (request, h) => {
  const { pageCount, readPage, name } = request.payload;

  const bookId = nanoid(16);
  const id = bookId;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;
  const isSuccess = name !== undefined && readPage <= pageCount ? true : false;

  const newBook = { ...request.payload, id, insertedAt, updatedAt, finished };

  if (isSuccess) {
    books.push(newBook);

    const response = h.response({
      'status': 'success',
      'message': 'Buku berhasil ditambahkan',
      'data': {
        bookId,
      },
    });
    response.code(201);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (name === undefined) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };

  const response = h.response({
    'status': 'error',
    'message': 'Buku gagal ditambahkan',
  });
  response.code(500);
  console.log(books);
  return response;
};

const getAllBoksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookIdFiltered = [];

  if (name != undefined) {
    bookIdFiltered = books.filter((book) => {
      const str = book.name.toLowerCase();
      const param = name.toLowerCase();

      const hasil = str.indexOf(param) > -1;
      return hasil;
    });
  };
  let usedBookArray = bookIdFiltered.length !== 0 ? bookIdFiltered : books;

  if (reading == 0) {
    bookIdFiltered = usedBookArray.filter((val) => {
      const isRead = val.reading;
      const result = isRead === false;

      return result;
    });
  } else if (reading == 1) {
    bookIdFiltered = usedBookArray.filter((val) => {
      const isRead = val.reading;
      const result = isRead === true;

      return result;
    });
  }

  usedBookArray = bookIdFiltered.length !== 0 ? bookIdFiltered : books;

  if (finished == 0) {
    bookIdFiltered = usedBookArray.filter((val) => val.finished === false);
  } else if (finished == 1) {
    bookIdFiltered = usedBookArray.filter((val) => val.finished === true);
  }

  if (name != undefined || reading != undefined || finished != undefined) {
    const booksFiltered = books.filter((book) => {
      const id = book.id;
      let result = undefined;
      bookIdFiltered.forEach((value) => id === value.id ? result = true : undefined);

      return result;
    });

    const response = h.response({
      status: 'success',
      data: {
        books: booksFiltered.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const data = books.filter((value) => value.id == bookId)[0];

  if (data != undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: data,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    readPage,
    pageCount,
    year,
    author,
    summary,
    publisher,
    reading,
  } = request.payload;
  const index = books.findIndex((value) => value.id == bookId);
  // console.log(index);

  // const isSuccess =
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };
  const response = h.response({
    'status': 'success',
    'message': 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const delBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((value) => value.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
export { addBookHandler, getAllBoksHandler, getBookByIdHandler, editBookByIdHandler, delBookByIdHandler };
