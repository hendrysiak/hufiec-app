export const localizationDataGrid = {
  // Root
  noRowsLabel: 'Brak wierszy',
  noResultsOverlayLabel: 'Nie znaleziono żadnych wyników.',
  errorOverlayDefaultLabel: 'Wystąpił błąd.',

  // Density selector toolbar button text
  toolbarDensity: 'Gęstość',
  toolbarDensityLabel: 'Gęstość',
  toolbarDensityCompact: 'Kompaktowy',
  toolbarDensityStandard: 'Standardowy',
  toolbarDensityComfortable: 'Komfortowy',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolumny',
  toolbarColumnsLabel: 'Wybierz kolumny',

  // Filters toolbar button text
  toolbarFilters: 'Filtry',
  toolbarFiltersLabel: 'Pokaż filtry',
  toolbarFiltersTooltipHide: 'Ukryj filtry',
  toolbarFiltersTooltipShow: 'Pokaż filtry',
  toolbarFiltersTooltipActive: (count: number): string => (count !== 1 ? `${count} aktywne filtry` : `${count} aktywny filtr`),

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksport',
  toolbarExportCSV: 'Pobierz jako CSV',
  toolbarExportPrint: 'Drukuj',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Znajdź kolumnę',
  columnsPanelTextFieldPlaceholder: 'Tytuł kolumny',
  columnsPanelDragIconLabel: 'Zmień kolejność kolumn',
  columnsPanelShowAllButton: 'Pokaż wszystkie',
  columnsPanelHideAllButton: 'Ukryj wszystko',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filtr',
  filterPanelDeleteIconLabel: 'Usuń',
  filterPanelOperators: 'Operatory',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'Kolumny',
  filterPanelInputLabel: 'Wartość',
  filterPanelInputPlaceholder: 'Wartość filtra',

  // Filter operators text
  filterOperatorContains: 'zawiera',
  filterOperatorEquals: 'równa się',
  filterOperatorStartsWith: 'zaczyna się od',
  filterOperatorEndsWith: 'kończy się na',
  filterOperatorIs: 'jest',
  filterOperatorNot: 'nie jest',
  filterOperatorAfter: 'jest po',
  filterOperatorOnOrAfter: 'jest na lub po',
  filterOperatorBefore: 'jest przed',
  filterOperatorOnOrBefore: 'jest na lub przed',
  filterOperatorIsEmpty: 'jest pusty',
  filterOperatorIsNotEmpty: 'nie jest pusty',

  // Filter values text
  filterValueAny: 'dowolny',
  filterValueTrue: 'prawdziwe',
  filterValueFalse: 'fałszywe',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Pokaż kolumny',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Ukryj',
  columnMenuUnsort: 'Nie sortuj',
  columnMenuSortAsc: 'Sortuj rosnąco',
  columnMenuSortDesc: 'Sortuj malejąco',

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number): string => (count !== 1 ? `${count} aktywne filtry` : `${count} aktywny filtr`),
  columnHeaderFiltersLabel: 'Pokaż filtry',
  columnHeaderSortIconLabel: 'Sortuj',

  // Rows selected footer text
  footerRowSelected: (count: number): string => (count !== 1
    ? `${count.toLocaleString()} rows selected`
    : `${count.toLocaleString()} row selected`),

  // Total rows footer text
  footerTotalRows: 'Łacznie wierszy:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount: number, totalCount: number): string => `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Wybieranie checkiem',

  // Boolean cell text
  booleanCellTrueLabel: 'prawdziwe',
  booleanCellFalseLabel: 'fałszywe',

  // Actions cell more text
  actionsCellMore: 'więcej',

  // Column pinning text
  pinToLeft: 'Przypnij do lewej',
  pinToRight: 'Przypnij do prawej',
  unpin: 'Przypnij',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: 'zobacz dzieci',
  treeDataCollapse: 'ukryj dzieci',
};
