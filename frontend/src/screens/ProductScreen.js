import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Modal,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { serverUrl } from "../utils/serverUrl";
import { addToCart } from "../actions/cartActions";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);

  const addToCartHandler = () => dispatch(addToCart(match.params.id, qty));
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const addToCartAndShowModal = () => {addToCartHandler();handleShow();}
  const goToCart = () => history.push("/cart");

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Added To Cart!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product.name} x {qty} added to cart
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={goToCart}>Go To Cart</Button>
        </Modal.Footer>
      </Modal>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"> {error} </Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image
              src={`${serverUrl}${product.image}`}
              alt={product.name}
              fluid
            />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                  color={"#f8e825"}
                />
              </ListGroup.Item>

              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Col>Status: </Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </Col>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty:</Col>
                      <Col>
                        <Form.Control
                          size="sm"
                          type="number"
                          min="1"
                          max={String(product.countInStock)}
                          value={Number(qty)}
                          className="text-center"
                          onChange={(e) => setQty(e.target.value)}
                        ></Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartAndShowModal}
                    className="btn-block"
                    disabled={product.countInStock === 0}
                    type="button"
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProductScreen;
