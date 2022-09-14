import * as React from "react";
import { Box } from "@twilio-paste/core/box";
import { ScreenReaderOnly } from "@twilio-paste/core/screen-reader-only";
import { CheckboxGroup, Checkbox } from "@twilio-paste/core/checkbox";
import { useUIDSeed } from "@twilio-paste/core/uid-library";
import {
  Pagination,
  PaginationItems,
  PaginationArrow,
  PaginationNumbers,
  PaginationNumber,
  PaginationEllipsis,
} from "@twilio-paste/core/pagination";

import {
  DataGrid,
  DataGridHead,
  DataGridRow,
  DataGridHeader,
  DataGridBody,
  DataGridCell,
} from "@twilio-paste/core/data-grid";
import { TableHeaderData } from "../../util/constants";

interface PaginatedDataGridProps {
  headers: string[];
  data: string[][];
  handleCheckedItems: any;
}

const getRange = (start: number, end: number): number[] => {
  return [...new Array(end - start + 1)].map((_, index) => index + start);
};

/* Calculates the correct display of the pagination numbers */
/* TODO: move this into the Pagination package as an export with tests */
const calculatePaginationState = (
  currentPage: number,
  pageCount: number
): number[] => {
  let delta;
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4;
  }

  let rangeStart = Math.round(currentPage - delta / 2);
  let rangeEnd = Math.round(currentPage + delta / 2);

  if (rangeStart - 1 === 1 || rangeEnd + 1 === pageCount) {
    rangeStart += 1;
    rangeEnd += 1;
  }

  let pages =
    currentPage > delta
      ? getRange(
          Math.min(rangeStart, pageCount - delta),
          Math.min(rangeEnd, pageCount)
        )
      : getRange(1, Math.min(pageCount, delta + 1));

  const withDots = (value: number, pair: number[]): number[] =>
    pages.length + 1 !== pageCount ? pair : [value];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, -1]).concat(pages);
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = pages.concat(withDots(pageCount, [-1, pageCount]));
  }

  return pages;
};

interface DataGridPaginationProps {
  currentPage?: number;
  pageCount: number;
  onPageChange: (newPageNumber: number) => void;
}

const DataGridPagination: React.FC<DataGridPaginationProps> = ({
  currentPage = 1,
  pageCount,
  onPageChange,
}) => {
  const goToNextPage = React.useCallback(() => {
    onPageChange(Math.min(currentPage + 1, pageCount));
  }, [currentPage, pageCount]);

  const goToPreviousPage = React.useCallback(() => {
    onPageChange(Math.max(currentPage - 1, 1));
  }, [currentPage]);

  const goToPage = React.useCallback((pageNumber: number) => {
    onPageChange(pageNumber);
  }, []);

  const paginationState = calculatePaginationState(currentPage, pageCount);

  /* eslint-disable react/no-array-index-key */
  return (
    <Pagination label="paged pagination navigation">
      <PaginationItems>
        <PaginationArrow
          label="Go to previous page"
          variant="back"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        />
        <PaginationNumbers>
          {paginationState.map((pageNumber, pageIndex) => {
            if (pageNumber === -1) {
              return (
                <PaginationEllipsis
                  key={`pagination-number-${pageIndex}`}
                  label="Collapsed previous pages"
                />
              );
            }

            return (
              <PaginationNumber
                label={`Go to page ${pageNumber}`}
                isCurrent={currentPage === pageNumber}
                onClick={() => {
                  goToPage(pageNumber);
                }}
                key={`pagination-number-${pageIndex}`}
              >
                {pageNumber}
              </PaginationNumber>
            );
          })}
        </PaginationNumbers>
        <PaginationArrow
          label="Go to next page"
          variant="forward"
          onClick={goToNextPage}
          disabled={currentPage === pageCount}
        />
      </PaginationItems>
    </Pagination>
  );
  /* eslint-enable react/no-array-index-key */
};

const PAGE_SIZE = 10;

interface CheckboxCellProps {
  onClick: (checked: boolean) => void;
  id: string;
  checked: boolean;
  label: string;
  indeterminate?: boolean;
}
const CheckboxCell: React.FC<CheckboxCellProps> = ({
  onClick,
  id,
  indeterminate,
  checked,
  label,
}) => {
  const checkboxRef = React.createRef<HTMLInputElement>();

  const handleClick = React.useCallback(() => {
    if (checkboxRef.current == null) {
      return;
    }
    return onClick(!checkboxRef.current.checked);
  }, [onClick, checkboxRef]);
  const handleKeyDown = React.useCallback(
    (event) => {
      if (checkboxRef.current == null) {
        return;
      }
      if (event.keyCode === 32 || event.keyCode === 13) {
        return onClick(!checkboxRef.current.checked);
      }
    },
    [onClick, checkboxRef]
  );

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onClick={handleClick}
      cursor="pointer"
    >
      <Box marginLeft="space20">
        <Checkbox
          id={id}
          checked={checked}
          onKeyDown={handleKeyDown}
          ref={checkboxRef}
          indeterminate={indeterminate}
        >
          <ScreenReaderOnly>{label}</ScreenReaderOnly>
        </Checkbox>
      </Box>
    </Box>
  );
};

const PaginatedDataGrid: React.FC<PaginatedDataGridProps> = (
  props: PaginatedDataGridProps
) => {
  React.useEffect(() => {
    console.log(
      "Paginated Data Grid, data updated, data.len now: ",
      props.data.length
    );
  }, [props.data]);

  const seed = useUIDSeed();
  // Array of length 10 rows, all unchecked
  const [checkedItems, _setCheckedItems] = React.useState(
    props.data.map(() => false)
  );

  const setCheckedItems = (items: boolean[]) => {
    _setCheckedItems(items);
    if (props.handleCheckedItems) props.handleCheckedItems(items);
  };

  const [currentPage, setCurrentPage] = React.useState(1);

  const allChecked = checkedItems.every(Boolean);
  const indeterminate = checkedItems.some(Boolean) && !allChecked;

  const rowIndexStart = (currentPage - 1) * PAGE_SIZE;
  const rowIndexEnd = Math.min(
    rowIndexStart + PAGE_SIZE - 1,
    props.data.length
  );

  const handlePagination = React.useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <CheckboxGroup name="items" legend={""}>
        <DataGrid aria-label="example grid">
          <DataGridHead>
            <DataGridRow>
              <DataGridHeader data-testid="first-cell" width="55px">
                <CheckboxCell
                  onClick={(checked: boolean) => {
                    const newCheckedItems = checkedItems.map(() => checked);
                    setCheckedItems(newCheckedItems);
                  }}
                  id={seed("select-all")}
                  checked={allChecked}
                  indeterminate={indeterminate}
                  label="Select all"
                />
              </DataGridHeader>
              {props.headers.map((item) => (
                <DataGridHeader key={item}>{item}</DataGridHeader>
              ))}
              {/* <DataGridHeader>{TableHeaderData[0]}</DataGridHeader>
              <DataGridHeader>{TableHeaderData[1]}</DataGridHeader>
              <DataGridHeader>{TableHeaderData[2]}</DataGridHeader> */}
              {/* <DataGridHeader>{TableHeaderData[3]}</DataGridHeader> */}
              {/* <DataGridHeader>{TableHeaderData[4]}</DataGridHeader> */}
            </DataGridRow>
          </DataGridHead>
          <DataGridBody>
            {props.data &&
              props.data
                .filter((_, rowIndex) => {
                  return rowIndex >= rowIndexStart && rowIndex <= rowIndexEnd;
                })
                .map((row, index) => {
                  const rowIndex = index + rowIndexStart;
                  return (
                    <DataGridRow
                      key={`row-${rowIndex}`}
                      selected={checkedItems[rowIndex]}
                    >
                      <DataGridCell data-testid={`cell-${rowIndex}-0`}>
                        <CheckboxCell
                          onClick={(checked: boolean) => {
                            const newCheckedItems = [...checkedItems];
                            newCheckedItems[rowIndex] = checked;
                            setCheckedItems(newCheckedItems);
                          }}
                          id={seed(`row-${rowIndex}-checkbox`)}
                          checked={checkedItems[rowIndex]}
                          label={`Select row ${rowIndex}`}
                        />
                      </DataGridCell>
                      {row.map((col, colIndex) => (
                        <DataGridCell
                          data-testid={`cell-${rowIndex}-${colIndex + 1}`}
                          key={`col-${colIndex}`}
                        >
                          {col}
                        </DataGridCell>
                      ))}
                    </DataGridRow>
                  );
                })}
          </DataGridBody>
        </DataGrid>
      </CheckboxGroup>
      <Box display="flex" justifyContent="center" marginTop="space70">
        <DataGridPagination
          currentPage={currentPage}
          pageCount={Math.ceil(
            (props.data.length > 0 ? props.data.length : 0) / PAGE_SIZE
          )}
          onPageChange={handlePagination}
        />
      </Box>
    </>
  );
  /* eslint-enable react/no-array-index-key */
};

export default PaginatedDataGrid;
