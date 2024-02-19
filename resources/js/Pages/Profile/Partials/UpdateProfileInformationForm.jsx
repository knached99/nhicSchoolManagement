import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import states from '@/constants/states';
export default function UpdateProfileInformation({className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        address_2: user.address_2,
        city: user.city, 
        state: user.state, 
        zip: user.zip 
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full p-3 cursor-not-allowed"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        readOnly
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full p-3 border-1 border-slate-400"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        type="phone"
                        className="mt-1 block w-full p-3 border-1 border-slate-400"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Phone"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>


                <div>
                    <InputLabel htmlFor="address" value="Street Address" />

                    <TextInput
                        id="address"
                        type="address"
                        className="mt-1 p-3 block w-full border-1 border-slate-400"
                        value={data.address}
                        placeholder="Street Address"
                        onChange={(e) => setData('address', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.address} />
                </div>

                <div>
                    <InputLabel htmlFor="address_2" value="Apartment/Unit Number" />

                    <TextInput
                        id="address_2"
                        type="address"
                        className="mt-1 p-3 block w-full border-1 border-slate-400"
                        value={data.address_2}
                        placeholder="Apartment/Unit Number"
                        onChange={(e) => setData('address_2', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.address_2} />
                </div>

                <div>
                    <InputLabel htmlFor="city" value="City" />

                    <TextInput
                        id="city"
                        type="city"
                        className="mt-1 p-3 block w-full border-1 border-slate-400"
                        value={data.city}
                        placeholder="City"
                        onChange={(e) => setData('city', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.city} />
                </div>

                <div>
                    <InputLabel htmlFor="state" value="State"/>
                    <select 
                    id="state"
                    name="state"
                    className="mt-1 p-3 block w-full border-1 border-slate-400"
                    onChange={(e)=>setData('state', e.target.value)}
                    >
                    <option value={data.state} selected>{data.state}</option>
                    {states.map((state) => (
                        <option key={state.abbreviation} value={state.abbreviation}>
                        {state.name}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="zip" value="Zip" />

                    <TextInput
                        id="zip"
                        type="zip"
                        className="mt-1 p-3 block w-full border-1 border-slate-400"
                        value={data.zip}
                        placeholder="Zip"
                        onChange={(e) => setData('zip', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.zip} />
                </div>

                {/* {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )} */}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
