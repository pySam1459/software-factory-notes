export type __PASCAL__ = {
  id: string;
  title: string;
};

function is__PASCAL__(value: unknown): value is __PASCAL__ {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    typeof value.id === 'string' &&
    typeof value.title === 'string'
  );
}

export async function get__PASCAL__(id: string): Promise<__PASCAL__> {
  const response = await fetch(`/api/__KEBAB__/${id}`);
  if (!response.ok) {
    throw new Error(`GET /api/__KEBAB__/${id} returned ${response.status}`);
  }
  const body: unknown = await response.json();
  if (!is__PASCAL__(body)) {
    throw new Error(`GET /api/__KEBAB__/${id} returned an unexpected body`);
  }
  return body;
}
