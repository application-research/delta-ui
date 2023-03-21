import Select from '@components/Select';

export default function ProviderSelect(props) {
  return (
    <Select default={'select a dataset...'} {...props}>
      {props.datasets?.map((dataset, i) => {
        return (
          <option value={dataset.name}>{dataset.name}</option>
        );
      })}
    </Select>
  );
}