// "use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { Table } from "antd";
import { readFromFile } from "@/lib/localData";

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
  const [selectedItems, setSelectedItems] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/storeData");
      const data = await response.json();
      setDataSource(data);
    };
    fetchData();
  }, []);

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
      },
    ];
  };

  const merge = (a: any, b: any, i = 0) => {
    let aa = [...a];
    return [...a.slice(0, i), ...b, ...aa.slice(i, aa.length)];
  };

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
      }).then((res) => {
        const data = res.json();
        console.log("data", data);
      });
    }
  };

  const DraggableContainer = (props: any) => (
    <SortableContain
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

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
      <Grid container maxWidth={"xl"} height={"100%"}>
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
                    borderRadius: "2px",
                    background: "#EFEFEF",
                  }}
                ></Grid>
                <Grid
                  component="div"
                  sx={{
                    width: "80px",
                    height: "40px",
                    borderRadius: "2px",
                    background: "#EFEFEF",
                  }}
                ></Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid component="div" width="100%">
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
            {selectedItems.length ? (
              <>{selectedItems.length} items selected </>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
}

// export async function getStaticProps() {
//   const localData = await readFromFile();

//   return {
//     props: { localData },
//   };
// }
