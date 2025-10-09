import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: () => '💪',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'The unique Clerk ID of the user who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Workout Status',
      description: 'The current status of the workout',
      type: 'string',
      options: {
        list: [
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'completed',
    }),
    defineField({
      name: 'date',
      title: 'Workout Date',
      description: 'The date when this workout was performed or scheduled',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'Total duration of the workout in seconds (for completed workouts)',
      type: 'number',
      validation: (Rule) => 
        Rule.custom((duration, context) => {
          const status = context.document?.status;
          if (status === 'completed' && (!duration || duration < 1)) {
            return 'Duration is required for completed workouts and must be at least 1 second';
          }
          if (duration && duration < 1) {
            return 'Duration must be at least 1 second';
          }
          return true;
        }),
    }),
    defineField({
      name: 'title',
      title: 'Workout Title',
      description: 'Optional custom title for the workout',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'notes',
      title: 'Workout Notes',
      description: 'Optional notes about the workout plan or performance',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'notificationSent',
      title: 'Notification Sent',
      description: 'Whether a push notification has been sent for this scheduled workout',
      type: 'boolean',
      initialValue: false,
      readOnly: true, // This should only be updated programmatically
    }),
    defineField({
      name: 'calendarEventId',
      title: 'Calendar Event ID',
      description: 'ID of the associated calendar event for scheduled workouts',
      type: 'string',
      readOnly: true, // This should only be updated programmatically
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      description: 'List of exercises in this workout with their sets and repetitions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'Reference to the exercise',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'List of sets for this exercise',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  fields: [
                    defineField({
                      name: 'repetitions',
                      title: 'Repetitions',
                      description: 'Number of repetitions performed in this set',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(1),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'Weight used for this set (optional for bodyweight exercises)',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                      initialValue: 0,
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      description: 'Unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      repetitions: 'repetitions',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare(selection) {
                      const { repetitions, weight, weightUnit } = selection
                      return {
                        title: `${repetitions} reps @ ${weight} ${weightUnit}`,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              exerciseName: 'exercise.name',
              sets: 'sets',
            },
            prepare(selection) {
              const { exerciseName, sets } = selection
              const setCount = sets ? sets.length : 0
              return {
                title: exerciseName || 'Unknown Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      status: 'status',
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
      userId: 'userId',
      title: 'title',
    },
    prepare(selection) {
      const { status, date, duration, exercises, userId, title } = selection
      const exerciseCount = exercises ? exercises.length : 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const formattedDuration = duration ? `${Math.floor(duration / 60)}m ${duration % 60}s` : ''
      
      const statusEmoji: Record<string, string> = {
        scheduled: '📅',
        in_progress: '🏃‍♂️',
        completed: '✅',
        cancelled: '❌'
      };
      const emoji = statusEmoji[status as string] || '💪';
      
      const workoutTitle = title || `${status?.charAt(0).toUpperCase() + status?.slice(1)} Workout`;
      
      let subtitle = `${emoji} ${formattedDate} • ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`;
      if (formattedDuration) {
        subtitle += ` • ${formattedDuration}`;
      }
      subtitle += ` • User: ${userId?.slice(0, 8)}...`;
      
      return {
        title: workoutTitle,
        subtitle,
      }
    },
  },
})