import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, useMantineTheme } from '@mantine/core';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchInput = forwardRef(function SearchInput({ className = '', placeholder, value, onChange }, ref) {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (value?.trim()) {
      navigate(`/results?query=${encodeURIComponent(value)}`);
    }
  };

  return (
    <TextInput
      ref={ref}
      value={value}
      onChange={onChange}
      radius="xl"
      size="md"
      placeholder={placeholder}
      rightSectionWidth={42}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon
          type="submit"
          size={32}
          radius="xl"
          color="black"
          variant="filled"
          onClick={handleSearch}
        >
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      sx={{
        input: {
          backgroundColor: theme.colorScheme === 'dark' ? '#5f6368' : '#fff',
          color: theme.colorScheme === 'dark' ? '#fff' : '#000',
          border: '1px solid',
          borderColor: theme.colorScheme === 'dark' ? '#444' : '#ddd',
          '&:focus': {
            borderColor: theme.colors.blue[5],
          },
        },
      }}


      className={className}
    />
  );
});

export default SearchInput;
