import { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import {
  PaginationContainer,
  PaginationItem,
  PaginationNext,
  PaginationPrev,
} from "../pages/styles/pages.styles";

type Props = {
  unitsPerPage: number;
  unitsCount: number;
  page: number;
  setPage: Function;
};

const PaginationBar = ({ unitsPerPage, unitsCount, page, setPage }: Props) => {
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    if (page - 1 <= 0) setPrevDisabled(true);
    if (unitsCount === 0 || page === Math.ceil(unitsCount / unitsPerPage))
      setNextDisabled(true);
    
    return () => {
      setNextDisabled(false);
      setPrevDisabled(false);
    }
  }, [page, unitsCount, unitsPerPage]);

  const pageItems = [];
  for (let i = 1; i <= Math.ceil(unitsCount / unitsPerPage); i++) {
    pageItems.push(
      <PaginationItem key={i} onClick={() => setPage(i)} active={page === i}>
        {i}
      </PaginationItem>
    );
  }

  return (
    <PaginationContainer>
      <Pagination>
        {unitsCount !== 0 && (
          <PaginationPrev
            disabled={prevDisabled}
            onClick={() => setPage(() => page - 1)}
          />
        )}
        {pageItems}
        {unitsCount !== 0 && (
          <PaginationNext
            disabled={nextDisabled}
            onClick={() => setPage(() => page + 1)}
          />
        )}
      </Pagination>
    </PaginationContainer>
  );
};

export default PaginationBar;
