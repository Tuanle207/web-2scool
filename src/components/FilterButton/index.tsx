import { FC, useState } from 'react';
import { ClickAwayListener, Box, Chip, Button } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useFilterButtonStyles from './index.styles';

export interface IFilterOption {
  id: string;
  label: string;
  value?: string | number;
}

interface IFilterButtonProps {
  title: string;
  options?: IFilterOption[];
  onSelectedOptionsChange?: (selectedOptions: IFilterOption[]) => void;
  defaultSelecteOptions?: IFilterOption[];
}

const FilterButton: FC<IFilterButtonProps> = ({
  title,
  options = [],
  onSelectedOptionsChange = () => {},
  defaultSelecteOptions = []
}) => {

  const styles = useFilterButtonStyles();

  const [ active, setActive ] = useState(false);
  const [ displayTitle, setDisplayTitle ] = useState(title);
  const [ selectedOptions, setSelectedOptions ] = useState<IFilterOption[]>(defaultSelecteOptions);

  const onButtonClick = () => {
    setActive((prev) => !prev);
  };

  const onClickAway = () => {
    setActive(false);
  };

  const onOptionClick = (option: IFilterOption) => {
    const options = [...selectedOptions];
    const index = options.findIndex((x) => x.id === option.id); 
    if (index === -1) {
      options.push(option);
    } else {
      options.splice(index, 1);
    }
    setSelectedOptions(options);
  };

  const updateTitle = (selectedOptions: IFilterOption[]) => {
    let newTitle = title;
    if (selectedOptions.length > 1) {
      newTitle = `${selectedOptions[0].label},...`;
    }  else if (selectedOptions.length > 0 ) {
      newTitle = selectedOptions[0].label;
    }

    setDisplayTitle(newTitle);
  };

  const onFinishClick = () => {
    onSelectedOptionsChange(selectedOptions);
    setActive(false);
    updateTitle(selectedOptions);
  };

  const onClearClick = () => {
    const options: IFilterOption[] = [];
    setSelectedOptions(options);
    onSelectedOptionsChange(options);
    setActive(false);
    updateTitle(options);
  };

  const isOptionSelected = (id: string) => {
    return selectedOptions.findIndex((x) => x.id === id) !== -1;
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box className={styles.root}>
        <button
          className={[styles.button, (active || selectedOptions.length > 0) ? styles.buttonActive : ""].join(" ")}
          onClick={onButtonClick}
        >
          <span className={styles.text}>
          { displayTitle }
          </span>
          {
            active ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />
          }
        </button>
        <Box className={[styles.optionsBox, active ? styles.optionsBoxActive : ""].join(" ")}>
          <Box className={styles.options}>
            {
              options.map((option) => (
                <Chip
                  id={option.id}
                  clickable
                  variant="outlined"
                  label={option.label}
                  className={styles.option}
                  onClick={() => onOptionClick(option)}
                  color={isOptionSelected(option.id) ? "primary" : "default"}
                />
              ))
            }
          </Box>
          <Box className={styles.actions}>
            <Button
              style={{ width: 160, marginRight: 16 }}
              variant="outlined"
              color="secondary"
              onClick={onClearClick}
            >
              Bỏ chọn
            </Button>
            <Button
              style={{ width: 160 }}
              variant="contained"
              color="primary"
              onClick={onFinishClick}
            >
              Chọn
            </Button>
          </Box>
        </Box>
      </Box>
    </ClickAwayListener>
  )
};

export default FilterButton;