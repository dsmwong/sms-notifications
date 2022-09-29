import * as React from "react";
import { SkeletonLoader } from "@twilio-paste/core/skeleton-loader";
import {
  DataGrid,
  DataGridHead,
  DataGridRow,
  DataGridHeader,
  DataGridBody,
  DataGridCell,
} from "@twilio-paste/core/data-grid";
import { TableHeaderData, TableBodyData } from "../../util/constants";

interface LoadingDataGridProps {
  headers: string[];
}

const LoadingDataGrid: React.FC<LoadingDataGridProps> = (
  props: LoadingDataGridProps
) => {
  // Used for random looking column widths
  const widths = [67, 53, 79, 59, 73, 61, 89, 97, 71, 83];
  const widthsLength = widths.length;
  /* eslint-disable react/no-array-index-key */
  return (
    <DataGrid aria-label="User information table">
      <DataGridHead>
        <DataGridRow>
          {props.headers.map((item) => (
            <DataGridHeader key={item}>{item}</DataGridHeader>
          ))}
          {/* <DataGridHeader>{TableHeaderData[0]}</DataGridHeader>
          <DataGridHeader>{TableHeaderData[1]}</DataGridHeader>
          <DataGridHeader>{TableHeaderData[2]}</DataGridHeader>
          <DataGridHeader>{TableHeaderData[3]}</DataGridHeader>
          <DataGridHeader>{TableHeaderData[4]}</DataGridHeader> */}
        </DataGridRow>
      </DataGridHead>
      <DataGridBody>
        {TableBodyData.map((row, rowIndex) => (
          <DataGridRow key={`row-${rowIndex}`}>
            {row.map((_, colIndex) => (
              <DataGridCell key={`col-${colIndex}`}>
                <SkeletonLoader
                  width={`${widths[(rowIndex + colIndex) % widthsLength]}%`}
                />
              </DataGridCell>
            ))}
          </DataGridRow>
        ))}
      </DataGridBody>
    </DataGrid>
  );
  /* eslint-enable react/no-array-index-key */
};

export default LoadingDataGrid;
