import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useLocationSuggestions } from '../../hooks/useLocationSuggestions'

export default function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
}) {
  const [selectedValue, setSelectedValue] = useState('')
  const suggestionInput = selectedValue === value ? '' : value
  const { data: options = [], isFetching, isError } = useLocationSuggestions(suggestionInput)
  const guidance = isError ? 'Suggestions unavailable — enter a location manually.' : undefined

  return (
    <Autocomplete
      freeSolo
      autoComplete
      filterOptions={(suggestions) => suggestions}
      options={options}
      inputValue={value}
      loading={isFetching}
      onInputChange={(_event, nextValue, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setSelectedValue('')
          onChange(nextValue)
        }
      }}
      onChange={(_event, nextValue) => {
        const nextLabel = typeof nextValue === 'string' ? nextValue : ''
        setSelectedValue(nextLabel)
        onChange(nextLabel)
      }}
      noOptionsText={value.trim().length < 3 ? 'Type at least 3 characters' : 'No matching locations'}
      renderInput={(params) => {
        const inputSlot = params.slotProps.input
        return (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText ?? guidance}
            slotProps={{
              ...params.slotProps,
              input: {
                ...inputSlot,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <Icon fontSize="small" />
                    </InputAdornment>
                    {inputSlot.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {isFetching ? <CircularProgress color="inherit" size={16} /> : null}
                    {inputSlot.endAdornment}
                  </>
                ),
              },
            }}
            fullWidth
          />
        )
      }}
    />
  )
}

LocationAutocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
}
