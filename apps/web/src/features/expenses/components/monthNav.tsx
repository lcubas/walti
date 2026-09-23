import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	currentPeriod,
	formatMonthPeriod,
	formatMonthShort,
	periodAddMonths,
	periodOf,
} from '@/lib/format/date';

type MonthNavProps = { period: string; onChange: (period: string) => void };

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

/** Expenses on a future month cannot exist yet — same rule as the date field
 * in the new-expense form — so "next" stops at the month the person is in,
 * both for the prev/next arrows and for every month in the picker below. */
export const MonthNav = ({ period, onChange }: MonthNavProps) => {
	const [pickerOpen, setPickerOpen] = useState(false);
	const [pickerYear, setPickerYear] = useState(() =>
		Number(period.slice(0, 4)),
	);
	const currentYear = Number(currentPeriod().slice(0, 4));

	return (
		<div className="flex items-center justify-between">
			<Button
				type="button"
				variant="ghost"
				size="icon-lg"
				aria-label="Mes anterior"
				onClick={() => onChange(periodAddMonths(period, -1))}
			>
				<ChevronLeft className="size-5" aria-hidden="true" />
			</Button>

			{/* The month label doubles as the screen's heading and, via the
			    popover, as a direct jump to any month — otherwise reaching
			    a distant month means many taps on the prev/next arrows. */}
			<h1 className="text-base font-semibold">
				<Popover
					open={pickerOpen}
					onOpenChange={(open) => {
						setPickerOpen(open);
						if (open) setPickerYear(Number(period.slice(0, 4)));
					}}
				>
					<PopoverTrigger
						render={
							<Button
								type="button"
								variant="ghost"
								className="h-auto gap-1 px-2 py-1 text-base font-semibold tracking-normal normal-case"
							/>
						}
					>
						<span className="capitalize">{formatMonthPeriod(period)}</span>
						<ChevronDown
							className="size-4 text-muted-foreground"
							aria-hidden="true"
						/>
					</PopoverTrigger>

					<PopoverContent className="w-72" align="center">
						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Año anterior"
								onClick={() => setPickerYear((year) => year - 1)}
							>
								<ChevronLeft className="size-4" aria-hidden="true" />
							</Button>

							<span className="text-sm font-semibold">{pickerYear}</span>

							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label="Año siguiente"
								disabled={pickerYear >= currentYear}
								onClick={() => setPickerYear((year) => year + 1)}
							>
								<ChevronRight className="size-4" aria-hidden="true" />
							</Button>
						</div>

						<div className="mt-3 grid grid-cols-3 gap-2">
							{MONTHS.map((month) => {
								const monthPeriod = periodOf(pickerYear, month);
								return (
									<Button
										key={month}
										type="button"
										variant={monthPeriod === period ? 'default' : 'outline'}
										size="sm"
										disabled={monthPeriod > currentPeriod()}
										onClick={() => {
											onChange(monthPeriod);
											setPickerOpen(false);
										}}
									>
										{formatMonthShort(month)}
									</Button>
								);
							})}
						</div>
					</PopoverContent>
				</Popover>
			</h1>

			<Button
				type="button"
				variant="ghost"
				size="icon-lg"
				aria-label="Mes siguiente"
				disabled={period >= currentPeriod()}
				onClick={() => onChange(periodAddMonths(period, 1))}
			>
				<ChevronRight className="size-5" aria-hidden="true" />
			</Button>
		</div>
	);
};
