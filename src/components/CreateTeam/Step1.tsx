import { Spinner } from '../ReactIcons/Spinner';
import { useEffect, useRef, useState } from 'preact/hooks';
import { httpPost } from '../../lib/http';
import type { ValidTeamType } from './Step0';

export const validTeamSizes = [
  '0-1',
  '2-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

export type ValidTeamSize = (typeof validTeamSizes)[number];

type Step1Props = {
  selectedTeamType: ValidTeamType;
  onStepComplete: (teamId: string) => void;
  onBack: () => void;
};

export function Step1(props: Step1Props) {
  const { selectedTeamType, onBack, onStepComplete } = props;
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nameRef.current) {
      return;
    }

    nameRef.current.focus();
  }, [nameRef]);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [teamSize, setTeamSize] = useState<ValidTeamSize>();

  const [canMemberSendInvite, setCanMemberSendInvite] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    if (!name || !selectedTeamType) {
      setIsLoading(false);
      return;
    }

    const { response, error } = await httpPost(
      `${import.meta.env.PUBLIC_API_URL}/v1-create-team`,
      {
        name,
        website: website || undefined,
        type: selectedTeamType,
        canMemberSendInvite,
        gitHubUrl: gitHubUrl || undefined,
        ...(selectedTeamType === 'company' && {
          teamSize,
          linkedInUrl: linkedInUrl || undefined,
        }),
        roadmapIds: [],
        bestPracticeIds: [],
      }
    );

    if (error || !response?._id) {
      setError(error?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      return;
    }

    onStepComplete(response._id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full flex-col">
        <label
          for="name"
          className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
        >
          {selectedTeamType === 'company' ? 'Company Name' : 'Group Name'}
        </label>
        <input
          type="text"
          name="name"
          ref={nameRef as any}
          autofocus={true}
          id="name"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
          placeholder="roadmap.sh"
          disabled={isLoading}
          required
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
      </div>

      {selectedTeamType === 'company' && (
        <div className="mt-4 flex w-full flex-col">
          <label
            for="website"
            className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
          >
            Website
          </label>
          <input
            type="url"
            name="website"
            required
            id="website"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://roadmap.sh"
            disabled={isLoading}
            value={website}
            onInput={(e) => setWebsite((e.target as HTMLInputElement).value)}
          />
        </div>
      )}

      {selectedTeamType === 'company' && (
        <div className="mt-4 flex w-full flex-col">
          <label for="website" className="text-sm leading-none text-slate-500">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="website"
            id="website"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://www.linkedin.com/company/roadmapsh"
            disabled={isLoading}
            value={linkedInUrl}
            onInput={(e) =>
              setLinkedInUrl((e.target as HTMLInputElement).value)
            }
          />
        </div>
      )}

      <div className="mt-4 flex w-full flex-col">
        <label for="website" className="text-sm leading-none text-slate-500">
          GitHub Organization URL
        </label>
        <input
          type="url"
          name="website"
          id="website"
          className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
          placeholder="https://github.com/roadmapsh"
          disabled={isLoading}
          value={gitHubUrl}
          onInput={(e) => setGitHubUrl((e.target as HTMLInputElement).value)}
        />
      </div>

      {selectedTeamType === 'company' && (
        <div className="mt-4 flex w-full flex-col">
          <label
            for="team-size"
            className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
          >
            Company Size
          </label>
          <select
            name="team-size"
            id="team-size"
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            required={selectedTeamType === 'company'}
            disabled={isLoading}
            value={teamSize}
            onChange={(e) =>
              setTeamSize((e.target as HTMLSelectElement).value as any)
            }
          >
            <option value="" selected>
              Select team size
            </option>
            {validTeamSizes.map((size) => (
              <option value={size}>{size} people</option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 flex w-full flex-col">
        <label
          for="can-member-send-invite"
          className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
        >
          Can team members invite new members to the team?
        </label>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className={`inline-flex items-center rounded-md border border-gray-300 px-4 py-1.5 text-sm focus:outline-none ${
              canMemberSendInvite ? 'bg-gray-200' : 'bg-white opacity-75'
            }`}
            onClick={() => setCanMemberSendInvite(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`inline-flex items-center rounded-md border border-gray-300 px-4 py-1.5 text-sm focus:outline-none ${
              !canMemberSendInvite ? 'bg-gray-200' : 'bg-white opacity-75'
            }`}
            onClick={() => setCanMemberSendInvite(false)}
          >
            No
          </button>
        </div>

        {error && (
          <p className="mb-2 mt-4 border-l-4 border-red-400 pl-2 text-base text-red-500">
            {error}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-row items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className={
            'rounded-md border border-red-400 bg-white px-4 py-2 text-red-500'
          }
        >
          <span className="mr-1">&larr;</span>
          Previous Step
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={
            'rounded-md border bg-black px-4 py-2 text-white disabled:opacity-50'
          }
        >
          {isLoading ? (
            <span className={'flex items-center justify-center'}>
              <Spinner />
              <span className="ml-2">Creating Team</span>
            </span>
          ) : (
            <>
              Next Step
              <span className="ml-1">&rarr;</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}