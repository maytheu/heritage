import React from "react";

import "./misc.css";

export const firebaseLooper = snapshot => {
  const data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    });
  });
  return data;
};

export const Spinner = () => (
  <div className="lds-roller">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export const thisWeek = lessonType => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  let weekToday = week(yyyy, mm, dd);

  let weekLesson = yyyy % lessonType;
  return 52 * weekLesson + weekToday;
};

function week(year, month, day) {
  function serial(days) {
    return 86400000 * days;
  }
  function dateserial(year, month, day) {
    return new Date(year, month - 1, day).valueOf();
  }
  function weekday(date) {
    return new Date(date).getDay() + 1;
  }
  function yearserial(date) {
    return new Date(date).getFullYear();
  }
  var date =
      year instanceof Date
        ? year.valueOf()
        : typeof year === "string"
        ? new Date(year).valueOf()
        : dateserial(year, month, day),
    date2 = dateserial(
      yearserial(date - serial(weekday(date - serial(1))) + serial(4)),
      1,
      3
    );
  return ~~((date - date2 + serial(weekday(date2) + 5)) / serial(7));
}
