import Select from '@components/basic/Select';

export default function ProviderSelect(props) {
  return (
    <Select placeholder={'select a dataset...'} {...props}>
      {props.datasets?.map((dataset, i) => {
        return (
          <option value={dataset.name}>{dataset.name}</option>
        );
      })}
    </Select>
  );
}