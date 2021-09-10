import Spinner from "./UI/Spinner";
import { Carousel, Image } from "react-bootstrap";
import { useEffect } from "react";
import useHttp from "../hooks/useHttp";
import { IProduct } from "../types/ProductInterface";
import { LinkContainer } from "react-router-bootstrap";

const TopProductsCarousel = () => {
  const {
    fetchedData: topProductsData,
    isFetching: isLoading,
    sendRequest: fetchTopProductsData,
  } = useHttp<IProduct[]>();

  useEffect(() => {
    fetchTopProductsData({
      url: "api/products/top",
      config: {
        method: "GET",
      },
    });
  }, [fetchTopProductsData]);

  return (
    <Carousel
      fade
      className="mb-5 top-product-carousel p-3 p-sm-5 shadow-sm rounded-1 fading-in"
    >
      {isLoading && (
        <Carousel.Item>
          <Spinner size={100} />
        </Carousel.Item>
      )}
      {topProductsData &&
        topProductsData.map((productData) => (
          <LinkContainer to={`/products/${productData.id}`}>
            <Carousel.Item key={productData.id}>
              <div className="d-flex align-items-center text-white justify-content-center cursor-pointer">
                <Image
                  src={productData.image}
                  alt={productData.name}
                  className="top-product-img"
                />
                <div className="carousel-shadow ms-3 ms-sm-5">
                  <h5 className="display-5">{productData.name}</h5>
                  <h6 className="display-6">${productData.price.toFixed(2)}</h6>
                </div>
              </div>
            </Carousel.Item>
          </LinkContainer>
        ))}
    </Carousel>
  );
};

export default TopProductsCarousel;
