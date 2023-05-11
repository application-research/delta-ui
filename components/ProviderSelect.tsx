import Select from '@components/basic/Select';

export default function ProviderSelect(props) {
  return (
    <Select placeholder='select a provider...' {...props}>
      {props.providers?.map((provider, i) => 
        <option value={provider.actor_id} key={provider}>
          {provider.actor_id} {provider.actor_name && `(${provider.actor_name})`}
        </option>
      )}
    </Select>
  );
}