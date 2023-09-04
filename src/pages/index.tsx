// "use client";
import Image from "next/image";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Grid,
  Input,
  Select,
  SelectChangeEvent,
  Typography,
  MenuItem,
} from "@mui/material";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { Table, Modal } from "antd";
import swal from "sweetalert";

export default function Home() {
  const DragHandle = SortableHandle(() => (
    <>
      <div
        style={{
          cursor: "grab",
          color: "#307C5A",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 6C9.10457 6 10 5.10457 10 4C10 2.89543 9.10457 2 8 2C6.89543 2 6 2.89543 6 4C6 5.10457 6.89543 6 8 6Z"
            fill="#307C5A"
          />
          <path
            d="M8 14C9.10457 14 10 13.1046 10 12C10 10.8954 9.10457 10 8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14Z"
            fill="#307C5A"
          />
          <path
            d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z"
            fill="#307C5A"
          />
          <path
            d="M16 6C17.1046 6 18 5.10457 18 4C18 2.89543 17.1046 2 16 2C14.8954 2 14 2.89543 14 4C14 5.10457 14.8954 6 16 6Z"
            fill="#307C5A"
          />
          <path
            d="M16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10C14.8954 10 14 10.8954 14 12C14 13.1046 14.8954 14 16 14Z"
            fill="#307C5A"
          />
          <path
            d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z"
            fill="#307C5A"
          />
        </svg>
      </div>
    </>
  ));

  const SortableItem = SortableElement((props: any) => <tr {...props} />);
  const SortableContain = SortableContainer((props: any) => (
    <tbody {...props} />
  ));

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataChanged, setDataChanged] = useState<boolean>(false); //update useeffect with boolean state
  const [selectedItems, setSelectedItems] = useState<any>([]);
  //modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  //edit
  const [record, setRecord] = useState<any>({});
  const [itemName, setItemName] = useState<string>("");
  const [itemNameError, setItemNameError] = useState<boolean>(false);
  const [itemPriority, setItemPriority] = useState<number | null>(null);
  const [itemPriorityError, setItemPriorityError] = useState<boolean>(false);
  //add
  const [fullName, setFullName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [priority, setPriority] = useState<number | null>(null);
  const [priorityError, setPriorityError] = useState<boolean>(false);

  // fetch data from storage json object
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/storeData");
      const data = await response.json();
      setDataSource(data);
    };
    fetchData();
  }, [dataChanged]);

  // table columns
  const getColumns = () => {
    return [
      {
        dataIndex: "",
        width: 30,
        className: "drag-visible",
        render: () => (
          <>
            <DragHandle />
          </>
        ),
      },
      {
        title: "Id",
        dataIndex: "user_id",
      },
      {
        title: "Full name",
        dataIndex: "fullname",
        className: "drag-visible",
      },
      {
        title: "Actions",
        dataIndex: "",
        className: "drag-visible",
        render: (record: any) => (
          <Grid
            container
            sx={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <Grid
              item
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setIsEditModalOpen(true);
                setRecord(record);
                setItemName(record.fullname);
                setItemPriority(record.priority);
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.8183 13.5364C25.1647 12.8769 24.1244 12.8184 23.4023 13.4005L15.8075 19.5219C15.6067 19.6838 15.4423 19.8869 15.3251 20.1177L14.8386 21.0756C14.0351 22.658 15.713 24.3511 17.2813 23.5403L18.3361 22.995C18.4442 22.9391 18.5464 22.8724 18.6413 22.796L26.1474 16.746C26.9929 16.0645 27.0632 14.7925 26.298 14.0204L25.8183 13.5364ZM24.3732 14.6268C24.4764 14.5436 24.625 14.552 24.7183 14.6462L25.198 15.1302C25.3074 15.2406 25.2973 15.4223 25.1765 15.5196L17.6704 21.5696C17.6568 21.5806 17.6422 21.5901 17.6268 21.5981L16.572 22.1434C16.348 22.2592 16.1082 22.0174 16.223 21.7913L16.7095 20.8334C16.7262 20.8004 16.7497 20.7714 16.7784 20.7483L24.3732 14.6268ZM13.7778 25.4304C13.3482 25.4304 13 25.7818 13 26.2152C13 26.6486 13.3482 27 13.7778 27H26.2222C26.6518 27 27 26.6486 27 26.2152C27 25.7818 26.6518 25.4304 26.2222 25.4304H13.7778Z"
                  fill="#047857"
                />
              </svg>
            </Grid>
            <Grid
              item
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setIsDeleteModalOpen(true);
                setRecord(record);
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.1097 15.7727C18.1097 15.6329 18.22 15.5195 18.3562 15.5195H21.6439C21.7801 15.5195 21.8905 15.6329 21.8905 15.7727V16.448C21.8905 16.5879 21.7801 16.7013 21.6439 16.7013H18.3562C18.22 16.7013 18.1097 16.5879 18.1097 16.448V15.7727ZM16.6477 16.7013C16.6362 16.6186 16.6302 16.534 16.6302 16.448V15.7727C16.6302 14.7937 17.403 14 18.3562 14H21.6439C22.5972 14 23.3699 14.7937 23.3699 15.7727V16.448C23.3699 16.534 23.364 16.6186 23.3524 16.7013H23.9453H25.2603C25.6689 16.7013 26.0001 17.0414 26.0001 17.461C26.0001 17.8806 25.6689 18.2208 25.2603 18.2208H24.685V25.2273C24.685 26.2063 23.9122 27 22.959 27H17.1326C16.1875 27 15.4181 26.2193 15.4067 25.2487L15.324 18.2208H14.7398C14.3312 18.2208 14.0001 17.8806 14.0001 17.461C14.0001 17.0414 14.3312 16.7013 14.7398 16.7013H16.0549H16.6477ZM18.3562 18.2208H16.8036L16.886 25.2303C16.8877 25.369 16.9976 25.4805 17.1326 25.4805H22.959C23.0951 25.4805 23.2055 25.3671 23.2055 25.2273V18.2208H21.6439H18.3562ZM19.4247 19.487C19.4247 19.0674 19.0935 18.7273 18.685 18.7273C18.2765 18.7273 17.9453 19.0674 17.9453 19.487V23.539C17.9453 23.9585 18.2765 24.2987 18.685 24.2987C19.0935 24.2987 19.4247 23.9585 19.4247 23.539V19.487ZM21.3151 18.7273C21.7237 18.7273 22.0549 19.0674 22.0549 19.487V23.539C22.0549 23.9585 21.7237 24.2987 21.3151 24.2987C20.9066 24.2987 20.5754 23.9585 20.5754 23.539V19.487C20.5754 19.0674 20.9066 18.7273 21.3151 18.7273Z"
                  fill="#047857"
                />
              </svg>
            </Grid>
          </Grid>
        ),
      },
    ];
  };

  //slice out moving index and keep in another array
  const merge = (a: any, b: any, i = 0) => {
    let aa = [...a];
    return [...a.slice(0, i), ...b, ...aa.slice(i, aa.length)];
  };

  // sort function after moving item
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    let tempDataSource = dataSource;

    if (oldIndex !== newIndex) {
      if (!selectedItems.length) {
        let movingItem = tempDataSource[oldIndex];
        tempDataSource.splice(oldIndex, 1);
        tempDataSource = merge(tempDataSource, [movingItem], newIndex);
      } else {
        let filteredItems: any[] = [];
        selectedItems.forEach((d: any) => {
          filteredItems.push(tempDataSource[d]); // this is how to push the value of an array item into another array
        });
        let newData: any[] = [];
        tempDataSource.forEach((d: any, i: number) => {
          if (!selectedItems.includes(i)) {
            newData.push(d);
          }
        });
        tempDataSource = [...newData];
        tempDataSource = merge(tempDataSource, filteredItems, newIndex);
      }

      setDataSource(tempDataSource);
      setSelectedItems([]);
      fetch("/api/storeData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempDataSource),
      })
        .then((res) => {
          res.json().then((res) => {
            if (res.response === true) {
              setDataChanged(!dataChanged);
            } else if (res.response === false) {
              console.log(res.message);
              swal({
                icon: "error",
                text: res.message,
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          swal({
            icon: "error",
            text: "Something went wrong. Please try again later!",
          });
        });
    }
  };

  //draggable container
  const DraggableContainer = (props: any) => (
    <SortableContain
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  //draggable row
  const DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x: any) => x.user_id === restProps["data-row-key"]
    );
    return (
      <SortableItem
        index={index}
        {...restProps}
        selected={selectedItems.length}
        onClick={(e: any) => {
          if (e.ctrlKey || e.metaKey) {
            selectedItems.includes(index)
              ? selectedItems.splice(selectedItems.indexOf(index), 1)
              : selectedItems.push(index);
            setSelectedItems(selectedItems);
          } else {
            setSelectedItems([]);
          }
        }}
      />
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <Grid container maxWidth={"auto"} height={"100%"}>
        {/* NAV */}
        <Grid
          container
          id="nav"
          width={"100%"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: "10px 40px 10px 40px",
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          <Grid item>
            <Image src={"/Polygon 1.svg"} alt="logo" width={60} height={60} />
          </Grid>
          <Grid item>
            <Grid
              component="div"
              sx={{
                display: "flex",
                gap: "24px",
                height: "24px",
              }}
            >
              <Grid
                component="div"
                sx={{
                  width: "180px",
                  height: "24px",
                  borderRadius: "2px",
                  background: "#0478571A",
                }}
              ></Grid>
              <Grid
                component="div"
                sx={{
                  width: "91px",
                  height: "24px",
                  borderRadius: "2px",
                  background: "#0478571A",
                }}
              ></Grid>
              <Grid
                component="div"
                sx={{
                  width: "120px",
                  height: "24px",
                  borderRadius: "2px",
                  background: "#0478571A",
                }}
              ></Grid>
              <Grid
                component="div"
                sx={{
                  width: "91px",
                  height: "24px",
                  borderRadius: "2px",
                  background: "#0478571A",
                }}
              ></Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              component="div"
              sx={{
                display: "flex",
                height: "36px",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <Grid
                component="div"
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "2px",
                  background: "#0478571A",
                }}
              ></Grid>
              <Grid
                component="div"
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "36px",
                  background: "#307C5A",
                }}
              ></Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* CONTAINER */}
        <Grid
          container
          id="container"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
            width: "95%",
            margin: "40px auto",
          }}
        >
          {/* HEADER */}
          <Grid
            component="div"
            id="header"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "40px",
              width: "100%",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: "700",
                fontSize: "18px",
                lineHeight: "24px",
                color: "#181818",
              }}
            >
              Employees
            </Typography>
            <Grid
              component="div"
              sx={{
                display: "flex",
                gap: "43px",
              }}
            >
              <Grid
                component={"div"}
                sx={{
                  display: "flex",
                  gap: "0px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    marginRight: "-35px",
                    zIndex: "55",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.71 20.29L18.88 17.47C20.4141 15.5746 21.1626 13.1629 20.9709 10.732C20.7792 8.30107 19.662 6.0364 17.8497 4.40495C16.0375 2.7735 13.6683 1.89965 11.2306 1.96361C8.79304 2.02756 6.47291 3.02444 4.74867 4.74867C3.02444 6.47291 2.02756 8.79304 1.96361 11.2306C1.89965 13.6683 2.7735 16.0375 4.40495 17.8497C6.0364 19.662 8.30107 20.7792 10.732 20.9709C13.1629 21.1626 15.5746 20.4141 17.47 18.88L20.29 21.71C20.3829 21.8037 20.4935 21.8781 20.6154 21.9289C20.7373 21.9796 20.868 22.0058 21 22.0058C21.132 22.0058 21.2627 21.9796 21.3845 21.9289C21.5064 21.8781 21.617 21.8037 21.71 21.71C21.8037 21.617 21.8781 21.5064 21.9289 21.3845C21.9796 21.2627 22.0058 21.132 22.0058 21C22.0058 20.868 21.9796 20.7373 21.9289 20.6154C21.8781 20.4935 21.8037 20.3829 21.71 20.29ZM3.99997 11.5C3.99997 10.0166 4.43984 8.56656 5.26395 7.33319C6.08806 6.09982 7.2594 5.13853 8.62984 4.57087C10.0003 4.00321 11.5083 3.85469 12.9631 4.14408C14.418 4.43347 15.7544 5.14777 16.8033 6.19667C17.8522 7.24556 18.5665 8.58193 18.8559 10.0368C19.1452 11.4916 18.9967 12.9997 18.4291 14.3701C17.8614 15.7405 16.9001 16.9119 15.6667 17.736C14.4334 18.5601 12.9833 19 11.5 19C9.51085 19 7.60319 18.2098 6.19667 16.8033C4.79014 15.3967 3.99997 13.4891 3.99997 11.5Z"
                      fill="#047857"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="search..."
                  style={{
                    border: "0.4px solid #047857",
                    borderRadius: "40px",
                    width: "346px",
                    height: "40px",
                    padding: "10px 16px 10px 36px",
                    background: "white",
                    color: "#181818",
                  }}
                />
              </Grid>
              <Grid
                component="div"
                sx={{
                  display: "flex",
                  width: "216px",
                  height: "40px",
                  gap: "21px",
                }}
              >
                <Grid
                  component="div"
                  sx={{
                    width: "115px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    border: "none",
                    background: "#047857",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    padding: "0px 15px",
                  }}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add
                </Grid>
                <Grid
                  component="div"
                  sx={{
                    width: "80px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    color: "#565656",
                    background: "#EFEFEF",
                  }}
                  onClick={() => setIsResetModalOpen(true)}
                >
                  Reset
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* TABLE LIST */}
          <Grid component="div" id="table" width="100%">
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={getColumns()}
              rowKey="user_id"
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
            />
          </Grid>

          {/* ADD MODAL */}
          <Modal
            title="Add Employee"
            open={isAddModalOpen}
            onOk={() => {
              setIsAddModalOpen(false);
              setFullName("");
              setPriority(null);
              setNameError(false);
              setPriorityError(false);
            }}
            onCancel={() => {
              setIsAddModalOpen(false);
              setFullName("");
              setPriority(null);
              setNameError(false);
              setPriorityError(false);
            }}
            footer={[
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    float: "right",
                    height: "40px",
                    marginTop: "-30px",
                  }}
                >
                  <button
                    key="back"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#565656",
                    }}
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setFullName("");
                      setPriority(null);
                      setNameError(false);
                      setPriorityError(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    key="submit"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "#047857",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      padding: "0px 15px",
                    }}
                    onClick={() => {
                      let tempDataSource = dataSource;
                      if (fullName.length > 0 && priority !== null) {
                        const string = fullName
                          .split(" ")
                          .map((s) => {
                            return s[0].toUpperCase() + s.substring(1);
                          })
                          .join(" ");
                        const d = new Date().toISOString();
                        const date = d.slice(0, d.length - 5);
                        let newEmployee = {
                          user_id: tempDataSource.length + 1,
                          fullname: string,
                          priority: priority,
                          created_at: date,
                          updated_at: date,
                        };
                        tempDataSource.push(newEmployee);
                        setDataSource(tempDataSource);
                        console.log("str", tempDataSource);
                        fetch("/api/storeData", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(tempDataSource),
                        })
                          .then((res) => {
                            res.json().then((res) => {
                              if (res.response === true) {
                                swal({
                                  icon: "success",
                                  title: "Success!",
                                  text: `Employee has been successfully created. You can now breathe a sigh of relief as the task is complete.`,
                                  buttons: [false, "Ok, thanks"],
                                });
                                setDataChanged(!dataChanged);
                                setIsAddModalOpen(false);
                                setFullName("");
                                setPriority(null);
                                setNameError(false);
                                setPriorityError(false);
                              } else if (res.response === false) {
                                console.log(res);
                                swal({
                                  icon: "error",
                                  text: res.message,
                                });
                              }
                            });
                          })
                          .catch((err) => {
                            console.error(err);
                            swal({
                              icon: "error",
                              text: "Something went wrong. Please try again later!",
                            });
                          });
                      } else {
                        swal({
                          icon: "error",
                          text: "Please fill all inputs before submitting",
                        });
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </>,
            ]}
          >
            <Grid
              component={"div"}
              sx={{
                margin: "30px 0px 60px 0px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* FULLNAME */}
              <Grid
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor="fullName"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "18px",
                    marginBottom: "12px",
                    color: "#565656",
                  }}
                >
                  Enter Full name
                </label>
                <Input
                  name="fullName"
                  sx={{
                    height: "48px",
                    backgroundColor: "#fafafa",
                    border: "none !important",
                    borderRadius: "8px",
                    padding: "13px 16px",
                    color: "#565656",
                  }}
                  autoFocus={true}
                  error={nameError === true ? true : false}
                  value={fullName}
                  onChange={(
                    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ): void => {
                    setFullName(event.target.value);
                  }}
                  onBlur={(
                    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ): void => {
                    if (event.target.value.length < 1) {
                      setNameError(true);
                    } else {
                      setNameError(false);
                    }
                  }}
                />
              </Grid>

              {/* PRIORITY */}
              <Grid
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor="priority"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "18px",
                    marginBottom: "12px",
                    color: "#565656",
                  }}
                >
                  Select Employee Priority
                </label>
                <Select
                  name="priority"
                  sx={{
                    height: "48px",
                    backgroundColor: "#fafafa",
                    border: "none !important",
                    borderRadius: "8px",
                    padding: "13px 16px",
                    color: "#565656",
                  }}
                  error={priorityError === true ? true : false}
                  value={priority}
                  onChange={(event: SelectChangeEvent<number | null>) => {
                    setPriority(Number(event.target.value));
                  }}
                  onBlur={(event: any) => {
                    if (event.target.value === null) {
                      setPriorityError(true);
                    } else {
                      setPriorityError(false);
                    }
                  }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Modal>

          {/* EDIT MODAL */}
          <Modal
            title="Edit"
            open={isEditModalOpen}
            onOk={() => {
              setIsEditModalOpen(false);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
            }}
            footer={[
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    float: "right",
                    height: "40px",
                    marginTop: "-30px",
                  }}
                >
                  <button
                    key="back"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#565656",
                    }}
                    onClick={() => {
                      setIsEditModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    key="submit"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "#047857",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      padding: "0px 15px",
                    }}
                    onClick={() => {
                      if (itemName.length > 0 && itemPriority !== null) {
                        let tempDataSource = dataSource;
                        let dataIndex = tempDataSource.find((s) => {
                          return s === record;
                        });
                        const d = new Date().toISOString();
                        const date = d.slice(0, d.length - 5);
                        tempDataSource.map((s, i) => {
                          if (tempDataSource[i] === dataIndex) {
                            tempDataSource[i].fullname = itemName;
                            tempDataSource[i].priority = itemPriority;
                            tempDataSource[i].updated_at = date;
                          }
                        });
                        setDataSource(tempDataSource);
                        fetch("/api/storeData", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(tempDataSource),
                        })
                          .then((res) => {
                            res.json().then((res) => {
                              setDataChanged(!dataChanged);
                              setIsEditModalOpen(false);
                            });
                          })
                          .catch((err) => {
                            console.error(err);
                            swal({
                              icon: "error",
                              text: "Something went wrong. Please try again later!",
                            });
                          });
                      } else {
                        swal({
                          icon: "error",
                          text: "Please fill all inputs before submitting",
                        });
                      }
                    }}
                  >
                    Apply
                  </button>
                </div>
              </>,
            ]}
          >
            <Grid
              component={"div"}
              sx={{
                margin: "30px 0px 60px 0px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* ITEM FULL NAME */}
              <Grid
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor="itemName"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "18px",
                    marginBottom: "12px",
                    color: "#565656",
                  }}
                >
                  Full name
                </label>
                <Input
                  name="itemName"
                  sx={{
                    height: "48px",
                    backgroundColor: "#fafafa",
                    border: "none !important",
                    borderRadius: "8px",
                    padding: "13px 16px",
                    color: "#565656",
                  }}
                  error={itemNameError === true ? true : false}
                  value={itemName}
                  onChange={(
                    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ): void => {
                    setItemName(event.currentTarget.value);
                  }}
                  onBlur={(
                    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ): void => {
                    if (event.target.value.length < 1) {
                      setItemNameError(true);
                    } else {
                      setItemNameError(false);
                    }
                  }}
                />
              </Grid>

              {/* ITEM PRIORITY */}
              <Grid
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor="itemPriority"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "18px",
                    marginBottom: "12px",
                    color: "#565656",
                  }}
                >
                  Select Employee Priority
                </label>
                <Select
                  name="itemPriority"
                  sx={{
                    height: "48px",
                    backgroundColor: "#fafafa",
                    border: "none !important",
                    borderRadius: "8px",
                    padding: "13px 16px",
                    color: "#565656",
                  }}
                  error={itemPriorityError === true ? true : false}
                  value={itemPriority}
                  onChange={(event: SelectChangeEvent<number | null>) => {
                    setItemPriority(Number(event.target.value));
                  }}
                  onBlur={(event: any) => {
                    if (event.target.value === null) {
                      setItemPriorityError(true);
                    } else {
                      setItemPriorityError(false);
                    }
                  }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Modal>

          {/* DELETE MODAL */}
          <Modal
            open={isDeleteModalOpen}
            onOk={() => {
              setIsDeleteModalOpen(false);
            }}
            onCancel={() => {
              setIsDeleteModalOpen(false);
            }}
            footer={[
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    float: "right",
                    height: "40px",
                    marginTop: "-30px",
                  }}
                >
                  <button
                    key="back"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#565656",
                    }}
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    key="submit"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "#047857",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      padding: "0px 15px",
                    }}
                    onClick={() => {
                      let tempDataSource = dataSource;
                      let dataIndex = tempDataSource.find((s) => {
                        return s === record;
                      });
                      tempDataSource.map((s, i) => {
                        if (tempDataSource[i] === dataIndex) {
                          tempDataSource.splice(i, 1);
                        }
                      });
                      setDataSource(tempDataSource);
                      fetch("/api/storeData", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(tempDataSource),
                      })
                        .then((res) => {
                          const d = res.json().then((res) => {
                            if (res.response === true) {
                              swal({
                                icon: "success",
                                title: "Success!",
                                text: `${record.fullname} has been successfully deleted. You can now breathe a sigh of relief as the task is complete.`,
                                buttons: [false, "Ok, thanks"],
                              });
                              setDataChanged(!dataChanged);
                              setIsDeleteModalOpen(false);
                            } else if (res.response === false) {
                              console.log(res);
                              swal({
                                icon: "error",
                                text: res.message,
                              });
                            }
                          });
                        })
                        .catch((err) => {
                          console.error(err);
                          swal({
                            icon: "error",
                            text: "Something went wrong. Please try again later!",
                          });
                        });
                    }}
                  >
                    Yes, Delete
                  </button>
                </div>
              </>,
            ]}
          >
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  marginTop: "30px",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="40"
                    height="40"
                    rx="20"
                    fill="#047857"
                    fillOpacity="0.1"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.1096 15.7727C18.1096 15.6329 18.22 15.5195 18.3562 15.5195H21.6438C21.78 15.5195 21.8904 15.6329 21.8904 15.7727V16.448C21.8904 16.5879 21.78 16.7013 21.6438 16.7013H18.3562C18.22 16.7013 18.1096 16.5879 18.1096 16.448V15.7727ZM16.6476 16.7013C16.6361 16.6186 16.6301 16.534 16.6301 16.448V15.7727C16.6301 14.7937 17.4029 14 18.3562 14H21.6438C22.5971 14 23.3699 14.7937 23.3699 15.7727V16.448C23.3699 16.534 23.3639 16.6186 23.3524 16.7013H23.9452H25.2603C25.6688 16.7013 26 17.0414 26 17.461C26 17.8806 25.6688 18.2208 25.2603 18.2208H24.6849V25.2273C24.6849 26.2063 23.9122 27 22.9589 27H17.1325C16.1874 27 15.418 26.2193 15.4066 25.2487L15.324 18.2208H14.7397C14.3312 18.2208 14 17.8806 14 17.461C14 17.0414 14.3312 16.7013 14.7397 16.7013H16.0548H16.6476ZM18.3562 18.2208H16.8035L16.886 25.2303C16.8876 25.369 16.9975 25.4805 17.1325 25.4805H22.9589C23.0951 25.4805 23.2055 25.3671 23.2055 25.2273V18.2208H21.6438H18.3562ZM19.4247 19.487C19.4247 19.0674 19.0935 18.7273 18.6849 18.7273C18.2764 18.7273 17.9452 19.0674 17.9452 19.487V23.539C17.9452 23.9585 18.2764 24.2987 18.6849 24.2987C19.0935 24.2987 19.4247 23.9585 19.4247 23.539V19.487ZM21.3151 18.7273C21.7236 18.7273 22.0548 19.0674 22.0548 19.487V23.539C22.0548 23.9585 21.7236 24.2987 21.3151 24.2987C20.9065 24.2987 20.5753 23.9585 20.5753 23.539V19.487C20.5753 19.0674 20.9065 18.7273 21.3151 18.7273Z"
                    fill="#047857"
                  />
                </svg>
              </Grid>
              <Grid
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <h3>Delete User</h3>
                <p>
                  Are you sure you want to delete <b>{`${record?.fullname}`}</b>{" "}
                  details?
                </p>
              </Grid>
            </Grid>
          </Modal>

          {/* RESET MODAL */}
          <Modal
            open={isResetModalOpen}
            onOk={() => {
              setIsResetModalOpen(false);
            }}
            onCancel={() => {
              setIsResetModalOpen(false);
            }}
            footer={[
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    float: "right",
                    height: "40px",
                    marginTop: "-30px",
                  }}
                >
                  <button
                    key="back"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#565656",
                    }}
                    onClick={() => {
                      setIsResetModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    key="submit"
                    style={{
                      width: "auto",
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      border: "none",
                      background: "#047857",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      padding: "0px 15px",
                    }}
                    onClick={() => {
                      let tempDataSource: any[] = [];
                      // const fetchData = async () => {
                      fetch("/api/originalStoreData")
                        .then((res) => {
                          res.json().then((response) => {
                            setDataSource(response);
                            fetch("/api/storeData", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(response),
                            })
                              .then((res) => {
                                const d = res.json().then((res) => {
                                  if (res.response === true) {
                                    swal({
                                      icon: "success",
                                      title: "Success!",
                                      text: `List has been successfully reset! You can now breathe a sigh of relief as the task is complete.`,
                                      buttons: [false, "Ok, thanks"],
                                    });
                                    setDataChanged(!dataChanged);
                                    setIsResetModalOpen(false);
                                  }
                                });
                              })
                              .catch((error) => {
                                console.error(error);
                                swal({
                                  icon: "error",
                                  text: "Something went wrong. Please try again later!",
                                });
                              });
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          swal({
                            icon: "error",
                            text: "Something went wrong. Please try again later!",
                          });
                        });
                      // console.log("str", tempDataSource);
                      // };
                      // fetchData();
                    }}
                  >
                    Yes, Reset
                  </button>
                </div>
              </>,
            ]}
          >
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid
                sx={{
                  marginTop: "30px",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="40"
                    height="40"
                    rx="20"
                    fill="#047857"
                    fillOpacity="0.1"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.1096 15.7727C18.1096 15.6329 18.22 15.5195 18.3562 15.5195H21.6438C21.78 15.5195 21.8904 15.6329 21.8904 15.7727V16.448C21.8904 16.5879 21.78 16.7013 21.6438 16.7013H18.3562C18.22 16.7013 18.1096 16.5879 18.1096 16.448V15.7727ZM16.6476 16.7013C16.6361 16.6186 16.6301 16.534 16.6301 16.448V15.7727C16.6301 14.7937 17.4029 14 18.3562 14H21.6438C22.5971 14 23.3699 14.7937 23.3699 15.7727V16.448C23.3699 16.534 23.3639 16.6186 23.3524 16.7013H23.9452H25.2603C25.6688 16.7013 26 17.0414 26 17.461C26 17.8806 25.6688 18.2208 25.2603 18.2208H24.6849V25.2273C24.6849 26.2063 23.9122 27 22.9589 27H17.1325C16.1874 27 15.418 26.2193 15.4066 25.2487L15.324 18.2208H14.7397C14.3312 18.2208 14 17.8806 14 17.461C14 17.0414 14.3312 16.7013 14.7397 16.7013H16.0548H16.6476ZM18.3562 18.2208H16.8035L16.886 25.2303C16.8876 25.369 16.9975 25.4805 17.1325 25.4805H22.9589C23.0951 25.4805 23.2055 25.3671 23.2055 25.2273V18.2208H21.6438H18.3562ZM19.4247 19.487C19.4247 19.0674 19.0935 18.7273 18.6849 18.7273C18.2764 18.7273 17.9452 19.0674 17.9452 19.487V23.539C17.9452 23.9585 18.2764 24.2987 18.6849 24.2987C19.0935 24.2987 19.4247 23.9585 19.4247 23.539V19.487ZM21.3151 18.7273C21.7236 18.7273 22.0548 19.0674 22.0548 19.487V23.539C22.0548 23.9585 21.7236 24.2987 21.3151 24.2987C20.9065 24.2987 20.5753 23.9585 20.5753 23.539V19.487C20.5753 19.0674 20.9065 18.7273 21.3151 18.7273Z"
                    fill="#047857"
                  />
                </svg>
              </Grid>
              <Grid
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <h3>Reset List!</h3>
                <p>
                  Are you sure you want to reset the list? This cannot be
                  reversed!
                </p>
              </Grid>
            </Grid>
          </Modal>
        </Grid>
      </Grid>
    </main>
  );
}
