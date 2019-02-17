import React from "react";
import { Link } from "react-router-dom";

const Books = () => {
  const lists = [
    { book: "Book: 1", lesson: "Lesson: 1 - 13", linkTo: '/view_book/1'},
    { book: "Book: 2", lesson: "Lesson: 14 - 26", linkTo: '/view_book/2' },
    { book: "Book: 3", lesson: "Lesson: 27 - 39", linkTo: '/view_book/3' },
    { book: "Book: 4", lesson: "Lesson: 40 - 52", linkTo: '/view_book/4' },
    { book: "Book: 5", lesson: "Lesson: 53 - 65", linkTo: '/view_book/5' },
    { book: "Book: 6", lesson: "Lesson: 66 - 78", linkTo: '/view_book/6' },
    { book: "Book: 7", lesson: "Lesson: 79 - 91", linkTo: '/view_book/7' },
    { book: "Book: 8", lesson: "Lesson: 92 - 104", linkTo: '/view_book/8' },
    { book: "Book: 9", lesson: "Lesson: 105 - 117", linkTo: '/view_book/9' },
    { book: "Book: 10", lesson: "Lesson: 118 - 130", linkTo: '/view_book/10' },
    { book: "Book: 11", lesson: "Lesson: 131 - 143", linkTo: '/view_book/11' },
    { book: "Book: 12", lesson: "Lesson: 144 - 156", linkTo: '/view_book/12' },
    { book: "Book: 13", lesson: "Lesson: 157 - 169", linkTo: '/view_book/13' },
    { book: "Book: 14", lesson: "Lesson: 170 - 182", linkTo: '/view_book/14' },
    { book: "Book: 15", lesson: "Lesson: 183 - 195", linkTo: '/view_book/15' },
    { book: "Book: 16", lesson: "Lesson: 196 - 209", linkTo: '/view_book/16' },
    { book: "Book: 17", lesson: "Lesson: 210 - 221", linkTo: '/view_book/17' },
    { book: "Book: 18", lesson: "Lesson: 222 - 234", linkTo: '/view_book/18' },
    { book: "Book: 19", lesson: "Lesson: 235 - 248", linkTo: '/view_book/9' },
    { book: "Book: 20", lesson: "Lesson: 249 - 261", linkTo: '/view_book/20' },
    { book: "Book: 21", lesson: "Lesson: 262 - 274", linkTo: '/view_book/21' },
    { book: "Book: 22", lesson: "Lesson: 275 - 287", linkTo: '/view_book/22' },
    { book: "Book: 23", lesson: "Lesson: 288 - 300", linkTo: '/view_book/23' },
    { book: "Book: 24", lesson: "Lesson: 301 - 313", linkTo: '/view_book/24' },
    { book: "Book: 25", lesson: "Lesson: 314 - 326", linkTo: '/view_book/25' },
    { book: "Book: 26", lesson: "Lesson: 327 - 339", linkTo: '/view_book/26' },
    { book: "Book: 27", lesson: "Lesson: 340 - 352", linkTo: '/view_book/27' },
    { book: "Book: 28", lesson: "Lesson: 353 - 365", linkTo: '/view_book/28' },
    { book: "Book: 29", lesson: "Lesson: 366 - 378", linkTo: '/view_book/29' },
    { book: "Book: 30", lesson: "Lesson: 379 - 391", linkTo: '/view_book/30' },
    { book: "Book: 31", lesson: "Lesson: 392 - 404", linkTo: '/view_book/31' },
    { book: "Book: 32", lesson: "Lesson: 405 - 418", linkTo: '/view_book/32' },
    { book: "Book: 33", lesson: "Lesson: 419 - 431", linkTo: '/view_book/33' },
    { book: "Book: 34", lesson: "Lesson: 432 - 444", linkTo: '/view_book/34' },
    { book: "Book: 35", lesson: "Lesson: 445 - 458", linkTo: '/view_book/35' },
    { book: "Book: 36", lesson: "Lesson: 459 - 471", linkTo: '/view_book/36' },
  ];
  return <div className="container">
  {lists.map(list =>(
      <Link to={list.linkTo} key={list.book}>
      <div className="chorus">
        <div>{list.book}</div>
        <div>{list.lesson}</div>
      </div>
    </Link>
  ))}
  </div>;
};

export default Books;
