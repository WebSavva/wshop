import { Row, Col, Container } from "react-bootstrap";
import Product from "../Components/Product";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/typed-hooks";
import { productsTriggerRequest } from "../store/products_slice";
import Spinner from "../Components/UI/Spinner";
import Message from "../Components/UI/Message";
import { useHistory, useLocation } from "react-router";
import PagePills from "../Components/PagePills";
import TopProductsCarousel from "../Components/TopProductsCarousel";
import Head from "../Components/Head";

const HomeScreen = () => {
  const location = useLocation();
  const {
    isFetching,
    error,
    data: { productsData, pagesNumber },
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const getPathLink = (pageNumber: string | number) =>
    `/products?page=${pageNumber}${
      searchValue ? "&search=" + searchValue : ""
    }`;
  const searchValue = new URLSearchParams(location.search).get("search");
  const currentPageNumber = new URLSearchParams(location.search).get("page");

  if (!currentPageNumber) {
    history.replace(getPathLink(1));
  }

  useEffect(() => {
    if (!currentPageNumber) return;
    dispatch(
      productsTriggerRequest({
        url: `${window.location.origin}/api/products?search=${
          searchValue || ""
        }&page=${currentPageNumber}`,
        config: {},
      })
    );
  }, [dispatch, searchValue, currentPageNumber]);

  let productItems: Array<JSX.Element> = [];
  if (Array.isArray(productsData)) {
    productItems = productsData.map((productData) => {
      return (
        <Col className="my-2" sm={6} md={4} lg={3} key={productData.id}>
          <Product {...productData} />
        </Col>
      );
    });
  }

  let content: JSX.Element[] | JSX.Element;

  if (error) {
    content = (
      <Message>Something went wrong. Please reload the page ...</Message>
    );
  } else if (isFetching) {
    content = <Spinner size={150} />;
  } else if (!productItems.length) {
    content = <Message>No products found ...</Message>;
  } else {
    content = (
      <>
        <Row>{productItems}</Row>
        {pagesNumber && currentPageNumber && (
          <PagePills
            getPathLink={getPathLink}
            currentPageNumber={+currentPageNumber}
            pagesNumber={pagesNumber}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Head />
      <Container>
        {!searchValue && (
          <>
            <TopProductsCarousel />
            <h2 className="fw-light">Latest Products</h2>
          </>
        )}
        {content}
      </Container>
    </>
  );
};

export default HomeScreen;
