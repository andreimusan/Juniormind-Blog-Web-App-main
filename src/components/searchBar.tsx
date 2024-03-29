import {
  SearchInput,
  SearchContainer,
  SearchIconContainer,
  SearchIcon,
  SearchCloseBtnContainer,
  SearchCloseBtn,
} from "../pages/styles/pages.styles";

type Props = {
  value: string;
  searchContent: Function;
};

const SearchBar = ({ value, searchContent }: Props) => {
  return (
    <SearchContainer id="searchBar">
      <SearchIconContainer>
        <SearchIcon />
      </SearchIconContainer>
      <SearchInput
        type="text"
        placeholder="search..."
        value={value}
        aria-label="search"
        onChange={(e) => {
          searchContent(e.target.value);
        }}
      />
      <SearchCloseBtnContainer>
        <SearchCloseBtn
          aria-label="Clear search"
          onClick={() => searchContent("")}
        />
      </SearchCloseBtnContainer>
    </SearchContainer>
  );
};

export default SearchBar;
