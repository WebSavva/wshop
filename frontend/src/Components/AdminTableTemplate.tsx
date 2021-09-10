import { useAppSelector } from "./../store/typed-hooks";
import useHttp from "../hooks/useHttp";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Col, Button, Container } from "react-bootstrap";
import Message from "./UI/Message";
import Spinner from "./UI/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faPlusCircle as faPlus,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ScreenLoader from "../Components/UI/ScreenLoader";
import { useEffect, useCallback } from "react";
import { IUserInfo } from "../types/AuthInterface";
import { IProduct } from "../types/ProductInterface";
import { IOrder } from "./../types/Order";

function AdminTableTemplate<
  T extends IUserInfo | IProduct | IOrder,
  FetchedDataType extends Array<T>
>({
  tableCellsConfig,
  fetchUrl,
  getEditLinkPage,
  createPageLink,
  dataName,
  isCreateAvailable,
}: {
  tableCellsConfig: Array<{
    headerText: string;
    type: string;
    name: string;
    trueReplacementDateName?: string;
  }>;
  dataName: string;
  fetchUrl: string;
  createPageLink?: string;
  isCreateAvailable: boolean;
  getEditLinkPage: (id: string) => string;
}) {
  const authUserInfo = useAppSelector((state) => state.auth.data);
  const {
    fetchedData: tableData,
    isFetching: isUsersFetching,
    error: fetchDataError,
    sendRequest: fetchTableData,
  } = useHttp<FetchedDataType>();

  const { isFetching: isUserDeleting, sendRequest: sendDeleteRequest } =
    useHttp<boolean>();
  const sendTableRequest = useCallback(() => {
    if (authUserInfo) {
      fetchTableData({
        url: fetchUrl,
        config: {
          headers: {
            Authorization: `Bearer ${authUserInfo?.token}`,
          },
        },
      });
    }
  }, [fetchTableData, authUserInfo, fetchUrl]);
  const deleteData = useCallback(
    (id: string) => {
      if (authUserInfo) {
        const confirmDelete = window.confirm("Do you really want to delete");
        if (!confirmDelete) return;
        sendDeleteRequest(
          {
            url: `api/admin/${dataName}s/${id}`,
            config: {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authUserInfo.token}`,
              },
            },
          },
          () => sendTableRequest()
        );
      }
    },
    [sendDeleteRequest, sendTableRequest, authUserInfo, dataName]
  );

  useEffect(() => {
    sendTableRequest();
  }, [sendTableRequest]);

  if (fetchDataError) {
    return <Message>{fetchDataError}</Message>;
  } else if (isUsersFetching) {
    return <Spinner size={150} />;
  } else if (tableData) {
    return (
      <Container>
        {isUserDeleting && <ScreenLoader />}
        <div className="d-flex justify-content-between mb-4">
          <h4 className="text-uppercase">{dataName}s</h4>
          {isCreateAvailable && createPageLink && (
            <LinkContainer to={createPageLink}>
              <Button variant="secondary">
                <span className="me-2 text-uppercase">new {dataName}</span>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </LinkContainer>
          )}
        </div>
        <Row>
          <Col>
            <Table responsive hover>
              <thead className="text-uppercase border-bottom border-secondary">
                {tableCellsConfig.map((cellConfig) => (
                  <th key={cellConfig.headerText} className="pb-3 px-2">
                    {cellConfig.headerText}
                  </th>
                ))}
              </thead>
              <tbody>
                {tableData.map((tableRowData) => (
                  <tr>
                    {tableCellsConfig.map((cellConfig) => {
                      let cellValue: string | JSX.Element;
                      let rawCellValue = (tableRowData as any)[cellConfig.name];
                      switch (cellConfig.type) {
                        case "boolean":
                          cellValue = (
                            <FontAwesomeIcon
                              icon={Boolean(rawCellValue) ? faCheck : faTimes}
                              className={
                                "d-block text-" +
                                (Boolean(rawCellValue) ? "success" : "danger")
                              }
                            />
                          );
                          if (
                            Boolean(rawCellValue) &&
                            cellConfig &&
                            cellConfig.trueReplacementDateName
                          ) {
                            let dateValue = String(
                              (tableRowData as any)[
                                cellConfig.trueReplacementDateName
                              ]
                            );
                            cellValue = new Date(
                              dateValue
                            ).toLocaleDateString();
                          }

                          break;
                        case "number":
                          cellValue = "$" + Number(rawCellValue).toFixed(2);
                          break;
                        case "string":
                          cellValue = rawCellValue;
                          break;
                        case "date":
                          cellValue = new Date(
                            rawCellValue
                          ).toLocaleDateString();
                          break;
                        default:
                          cellValue = "";
                          break;
                      }

                      return <td>{cellValue}</td>;
                    })}
                    <td>
                      <div className="d-flex text-uppercase text-white">
                        <Button
                          variant="danger"
                          onClick={deleteData.bind(null, tableRowData.id)}
                          className="flex-grow-1 me-2"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        <LinkContainer to={getEditLinkPage(tableRowData.id)}>
                          <Button variant="info" className="flex-grow-1">
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </LinkContainer>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
}
export default AdminTableTemplate;
