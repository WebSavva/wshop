import { ListGroup, Image } from "react-bootstrap";
import { IOrderItem } from "../types/Order";
import { LinkContainer } from "react-router-bootstrap";
const OrderItemCard: React.FC<{
  itemData: IOrderItem;
}> = ({ itemData }) => {
  const wordsMatch = itemData.name.match(/\w+/gi);
  let shortenedName: string;
  if (!wordsMatch || (wordsMatch && wordsMatch.length <= 2)) {
    shortenedName = itemData.name;
  } else {
    shortenedName = wordsMatch.slice(0, 2).join(" ");
  }
  return (
    <ListGroup.Item
      key={itemData.product}
      className="d-flex align-items-center py-3 text-secondary px-0"
    >
      <div className="w-25">
        <Image
          src={itemData.image}
          alt={itemData.name}
          className="order-item-img me-2"
        />
      </div>
      <span className="fw-bold">{shortenedName}</span>
      <span className="fs-9 ms-auto">
        {itemData.qty} &#10005; ${itemData.price} = $
        {(itemData.price * itemData.qty).toFixed(2)}
      </span>
    </ListGroup.Item>
  );
};

export default OrderItemCard;
