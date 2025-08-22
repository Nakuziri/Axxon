"use client";
import { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

type Todo = {
  id: number | string;
  text: string;
  color?: string;
};

type TodosByDate = Record<string, Todo[]>;

type CalendarProps = {
  todosByDate: TodosByDate;
};

const daysOfWeek = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];

export default function Calendar({ todosByDate }: CalendarProps) {
  const today = dayjs();
  const monthsBefore = 12;
  const monthsAfter = 12;

  const months = Array.from({ length: monthsBefore + monthsAfter + 1 }).map(
    (_, i) => today.add(i - monthsBefore, "month")
  );

  const [monthIndex, setMonthIndex] = useState(monthsBefore);
  const currentMonth = months[monthIndex];

  const prevMonth = () => {
    if (monthIndex > 0) setMonthIndex(monthIndex - 1);
  };

  const nextMonth = () => {
    if (monthIndex < months.length - 1) setMonthIndex(monthIndex + 1);
  };

  // Generate 42 days for 6-week calendar grid
  const startOfMonth = currentMonth.startOf("month").startOf("week");
  const days = Array.from({ length: 42 }).map((_, i) => startOfMonth.add(i, "day"));

  return (
    <div className="max-w-full mx-auto w-[60%] h-screen border border-gray-200 rounded flex flex-col text-black">
      {/* Header with buttons on sides */}
      <div className="flex items-center justify-between p-2 bg-white border-b border-gray-300 h-12">
        {/* Previous month button */}
        <button
          onClick={prevMonth}
          className="px-2 py-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
          disabled={monthIndex === 0}
        >
          &lt;
        </button>

        {/* Month label centered */}
        <div className="font-semibold text-center flex-1">{currentMonth.format("MMMM YYYY")}</div>

        {/* Next month button */}
        <button
          onClick={nextMonth}
          className="px-2 py-1 rounded hover:bg-gray-100 transition disabled:opacity-50"
          disabled={monthIndex === months.length - 1}
        >
          &gt;
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 border-b border-gray-300 bg-gray-100 text-center font-medium h-10">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, i) => {
          const key = day.format("YYYY-MM-DD");
          const todos = todosByDate[key] || [];
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = day.isSame(today, "day");

          return (
            <div
              key={i}
              className={clsx(
                "border border-gray-300 p-2 flex flex-col text-sm",
                {
                  "bg-white": isCurrentMonth,
                  "bg-gray-50 text-gray-400": !isCurrentMonth,
                  "bg-blue-100 border-blue-400": isToday,
                }
              )}
            >
              <div className={clsx("mb-1 font-semibold", { "text-blue-600": isToday })}>
                {day.date()}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {todos.slice(0, 3).map((todo) => (
                  <div key={todo.id} className="flex items-center truncate text-xs">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: todo.color }}
                    />
                    {todo.text}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
