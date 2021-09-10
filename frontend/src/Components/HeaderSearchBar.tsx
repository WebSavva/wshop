import React from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useRef } from "react";

const HeaderSearchBar = () => {
  const history = useHistory();
  const searchInput = useRef<HTMLInputElement | null>(null);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.current) {
      const enteredName = searchInput.current.value;
      let searchValue: string =
        enteredName.length > 0 ? `?search=${enteredName}` : "";
      history.push(`/products${searchValue}&page=1`);
      searchInput.current.value = "";
    }
  };
  return (
    <Form onSubmit={onSubmitHandler} className="d-flex align-items-center my-2">
      <Form.Control
        type="text"
        ref={searchInput}
        placeholder="Enter Product Name"
        className="fs-8 me-2 w-75 rounded-1 fw-light"
      />
      <Button type="submit" className="fs-10" variant="outline-success ">
        Submit
      </Button>
    </Form>
  );
};

export default HeaderSearchBar;
