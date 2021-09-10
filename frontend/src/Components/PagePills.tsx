import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const PagePills: React.FC<{
  pagesNumber: number;
  currentPageNumber: number;
  getPathLink: (page: string | number) => string;
}> = ({ pagesNumber, currentPageNumber, getPathLink }) => {
  let paginationContent: JSX.Element | null;

  const firstPagePill = (
    <LinkContainer to={getPathLink(1)}>
      <Pagination.Item>{1}</Pagination.Item>
    </LinkContainer>
  );

  const lastPagePill = (
    <LinkContainer to={getPathLink(pagesNumber)}>
      <Pagination.Item>{pagesNumber}</Pagination.Item>
    </LinkContainer>
  );

  switch (true) {
    case pagesNumber < 4:
      paginationContent = (
        <>
          {Array.from({ length: pagesNumber }, (_, i) => (
            <LinkContainer to={getPathLink(i + 1)}>
              <Pagination.Item active={i + 1 === currentPageNumber}>
                {i + 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
        </>
      );
      break;
    case Math.abs(currentPageNumber) < 3:
      paginationContent = (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <LinkContainer to={getPathLink(i + 1)}>
              <Pagination.Item active={i + 1 === currentPageNumber}>
                {i + 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
          <Pagination.Ellipsis />
          {lastPagePill}
        </>
      );
      break;
    case Math.abs(pagesNumber - currentPageNumber) < 3:
      paginationContent = (
        <>
          {firstPagePill}
          <Pagination.Ellipsis />
          {Array.from({ length: 3 }, (_, i) => (
            <LinkContainer to={getPathLink(i + 1)}>
              <Pagination.Item active={i + 1 === currentPageNumber}>
                {i + 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
        </>
      );
      break;
    case currentPageNumber % 2 === 0:
      paginationContent = (
        <>
          {firstPagePill}
          <Pagination.Ellipsis />
          {Array.from({ length: 3 }, (_, i) => (
            <LinkContainer to={getPathLink(i + currentPageNumber - 1)}>
              <Pagination.Item active={i === 1}>
                {i + currentPageNumber - 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
          <Pagination.Ellipsis />
          {lastPagePill}
        </>
      );
      break;
    case currentPageNumber % 2 !== 0:
      paginationContent = (
        <>
          {firstPagePill}
          <Pagination.Ellipsis />
          {Array.from({ length: 3 }, (_, i) => (
            <LinkContainer key={i} to={getPathLink(currentPageNumber + i)}>
              <Pagination.Item active={i === 0}>
                {currentPageNumber + i}
              </Pagination.Item>
            </LinkContainer>
          ))}
          <Pagination.Ellipsis />
          {lastPagePill}
        </>
      );
      break;
    default:
      paginationContent = null;
      break;
  }

  return (
    <div className="w-100 d-flex justify-content-center mt-3 mt-sm-5">
      <Pagination>
        <LinkContainer to={getPathLink(1)}>
          <Pagination.First disabled={currentPageNumber === 1} />
        </LinkContainer>
        <LinkContainer to={getPathLink(currentPageNumber - 1)}>
          <Pagination.Prev disabled={currentPageNumber - 1 < 1} />
        </LinkContainer>
        {paginationContent}
        <LinkContainer to={getPathLink(currentPageNumber + 1)}>
          <Pagination.Next disabled={currentPageNumber + 1 > pagesNumber} />
        </LinkContainer>
        <LinkContainer to={getPathLink(pagesNumber)}>
          <Pagination.Last disabled={currentPageNumber === pagesNumber} />
        </LinkContainer>
      </Pagination>
    </div>
  );
};

export default PagePills;
