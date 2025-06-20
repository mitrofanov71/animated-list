import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

const ITEMS_PER_PAGE = 20;

const generatePeople = () => {
  const names = [
    "John",
    "John2",
    "John3",
    "John4",
    "John5",
    "John6",
    "John7",
    "John8",
  ];
  const surnames = [
    "Doe",
    "Doe2",
    "Doe3",
    "Doe4",
    "Doe5",
    "Doe6",
    "Doe7",
    "Doe8",
  ];

  return Array.from({ length: 100 }, () => ({
    name: names[Math.floor(Math.random() * names.length)],
    surname: surnames[Math.floor(Math.random() * surnames.length)],
  }));
};

function App() {
  const allData = useRef(generatePeople());
  const [renderedItems, setRenderedItems] = useState([]);
  const [newItems, setNewItems] = useState([]);

  const loadMore = () => {
    const currentLength = renderedItems.length;
    const nextItems = allData.current.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );
    setRenderedItems((prev) => [...prev, ...nextItems]);
    setNewItems(nextItems);
  };

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom && renderedItems.length < allData.current.length) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [renderedItems]);

  return (
    <div className="container">
      {renderedItems.map((person, i) => {
        const prevItemsLength = renderedItems.length - ITEMS_PER_PAGE;

        const isNew = newItems.includes(person);

        const content = (
          <div className="card">
            {person.name} {person.surname}
          </div>
        );

        return isNew ? (
          <motion.div
            key={`${person.name}-${person.surname}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay:
                renderedItems.length > ITEMS_PER_PAGE
                  ? (i + 1 - prevItemsLength) * 0.1
                  : i * 0.1,
            }}
          >
            {content}
          </motion.div>
        ) : (
          <div key={`${person.name}-${person.surname}-${i}`}>{content}</div>
        );
      })}
    </div>
  );
}

export default App;
